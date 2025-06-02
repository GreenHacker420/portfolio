
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Send, X, Maximize2, Minimize2 } from 'lucide-react';
import { trackEvent, portfolioEvents } from '@/components/analytics/GoogleAnalytics';

// Chatbot commands and responses
const COMMANDS = {
  help: [
    '💻 Available Commands:',
    '- help: Display this help message',
    '- about: Learn about Green Hacker',
    '- skills: View technical skills',
    '- projects: Show recent projects',
    '- contact: Get contact information',
    '- clear: Clear the terminal',
    '- exit: Close the chatbot',
    '',
    'You can also just chat naturally!'
  ],
  about: [
    'Hey there! 👋 I\'m Green Hacker, a full-stack developer and ML enthusiast.',
    'When I\'m not coding, I\'m probably hiking, gaming, or learning something new.',
    'I specialize in creating interactive web experiences and AI-powered applications.'
  ],
  skills: [
    '🚀 Technical Skills:',
    '- Frontend: React, TypeScript, Tailwind CSS, Framer Motion',
    '- Backend: Node.js, Express, FastAPI, GraphQL',
    '- ML/AI: PyTorch, TensorFlow, Computer Vision',
    '- DevOps: Docker, AWS, CI/CD, Kubernetes',
    '- Other: Three.js, React Three Fiber, WebGL'
  ],
  projects: [
    '📁 Recent Projects:',
    '1. AI Photo Platform - Face recognition for intelligent photo organization',
    '2. Portfolio Website - You\'re looking at it right now!',
    '3. ML Research Tool - Natural language processing for scientific papers',
    '4. Real-time Collaboration App - WebRTC and WebSockets for seamless teamwork',
    '',
    'Type "project [number]" for more details!'
  ],
  'project 1': [
    '📷 AI Photo Platform',
    'A machine learning application that uses facial recognition to organize and tag photos.',
    'Tech stack: React, TypeScript, PyTorch, AWS S3, Tailwind CSS',
    'Features: Face recognition, automatic tagging, search by person, cloud storage'
  ],
  'project 2': [
    '🌐 Portfolio Website',
    'An interactive portfolio showcasing my projects and skills with 3D elements.',
    'Tech stack: React, Three.js, Framer Motion, Tailwind CSS',
    'Features: 3D visualization, interactive components, responsive design'
  ],
  'project 3': [
    '📚 ML Research Tool',
    'An AI-powered tool that helps researchers find relevant papers and extract insights.',
    'Tech stack: Python, TensorFlow, FastAPI, React',
    'Features: Paper recommendation, text summarization, citation network analysis'
  ],
  'project 4': [
    '👥 Real-time Collaboration App',
    'A platform for teams to collaborate with document sharing and real-time editing.',
    'Tech stack: React, Node.js, Socket.io, WebRTC, MongoDB',
    'Features: Live document editing, video chat, project management tools'
  ],
  contact: [
    '📫 Contact Information:',
    'Email: hello@greenhacker.dev',
    'GitHub: github.com/greenhacker',
    'LinkedIn: linkedin.com/in/greenhacker',
    'Twitter: @greenhacker'
  ],
  clear: [''],
  exit: ['👋 Goodbye! You can open me again by clicking the terminal icon.']
};

interface Message {
  type: 'user' | 'bot';
  content: string[];
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: [
        '👋 Hi there! I\'m GREENHACKER\'s AI assistant.',
        'I can tell you about GREENHACKER, their skills, projects, or how to get in touch.',
        'Type "help" to see what I can do!'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const toggleChat = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    // Track chat interactions
    if (newState) {
      trackEvent(portfolioEvents.aiChatStart);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const processCommand = (command: string) => {
    const lowercaseCommand = command.toLowerCase().trim();

    if (lowercaseCommand === 'exit') {
      setMessages([...messages, { type: 'user', content: [command] }, { type: 'bot', content: COMMANDS.exit }]);
      setTimeout(() => setIsOpen(false), 1000);
      return;
    }

    if (lowercaseCommand === 'clear') {
      setMessages([]);
      return;
    }

    if (COMMANDS[lowercaseCommand as keyof typeof COMMANDS]) {
      setMessages([...messages, { type: 'user', content: [command] }, { type: 'bot', content: COMMANDS[lowercaseCommand as keyof typeof COMMANDS] }]);
      return;
    }

    // Generate AI response for unknown commands
    setMessages([...messages, { type: 'user', content: [command] }]);
    setIsTyping(true);

    // Call AI API with proper async handling
    setTimeout(async () => {
      try {
        const aiResponse = await generateAIResponse(command);
        setMessages(prev => [...prev, { type: 'bot', content: aiResponse }]);
      } catch (error) {
        console.error('AI response error:', error);
        const fallbackResponse = getFallbackResponse(command);
        setMessages(prev => [...prev, { type: 'bot', content: fallbackResponse }]);
      } finally {
        setIsTyping(false);
      }
    }, 1000 + Math.random() * 1000);
  };

  const generateAIResponse = async (input: string) => {
    // Check if we're on the client side
    if (typeof window === 'undefined') {
      return getFallbackResponse(input);
    }

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          context: 'Terminal interface - GREENHACKER portfolio inquiry'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Format response for terminal display
        return formatTerminalResponse(data.response);
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Terminal AI error:', error);
      // Fallback to local responses
      return getFallbackResponse(input);
    }
  };

  const formatTerminalResponse = (response: string) => {
    // Split long responses into multiple lines for better terminal display
    const maxLineLength = 60;
    const words = response.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      if (currentLine.length + word.length + 1 <= maxLineLength) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);

    return lines;
  };

  const getFallbackResponse = (input: string) => {
    const lowercaseInput = input.toLowerCase();

    if (lowercaseInput.includes('hi') || lowercaseInput.includes('hello') || lowercaseInput.includes('hey')) {
      return ['Hello! How can I help you today? 😊', 'Type "help" to see what I can do.'];
    } else if (lowercaseInput.includes('thanks') || lowercaseInput.includes('thank you')) {
      return ['You\'re welcome! Anything else you\'d like to know?'];
    } else if (lowercaseInput.includes('experience') || lowercaseInput.includes('work')) {
      return ['GREENHACKER has extensive experience in full-stack', 'development and machine learning projects.', 'They\'ve worked on various AI-powered applications.'];
    } else if (lowercaseInput.includes('education')) {
      return ['GREENHACKER has strong technical education and', 'continuously learns new technologies.', 'They specialize in AI and web development.'];
    } else if (lowercaseInput.includes('name')) {
      return ['My name is GreenBot! I\'m GREENHACKER\'s AI assistant.'];
    } else {
      return ['I\'m not sure I understand that query.', 'Type "help" to see what commands are available.', 'Or ask me about GREENHACKER\'s skills and projects!'];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // Track message sending
      trackEvent(portfolioEvents.aiChatMessage);

      processCommand(input);
      setInput('');
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        className="fixed bottom-8 right-8 bg-neon-green text-black h-12 w-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
      >
        <Terminal size={20} />
      </motion.button>

      {/* Chatbot Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed ${isExpanded ? 'inset-4 md:inset-10' : 'bottom-24 right-8 w-[350px] md:w-[400px] h-[500px]'} bg-black border border-neon-green/50 rounded-lg shadow-lg overflow-hidden z-50 flex flex-col`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Chatbot Header */}
            <div className="flex items-center justify-between p-3 border-b border-neon-green/30 bg-black">
              <div className="flex items-center">
                <Terminal className="text-neon-green mr-2" size={18} />
                <h3 className="text-neon-green font-mono text-sm">GREENHACKER Terminal</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="text-neon-green hover:text-white transition-colors focus:outline-none"
                  onClick={toggleExpand}
                >
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  className="text-neon-green hover:text-white transition-colors focus:outline-none"
                  onClick={toggleChat}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chatbot Messages */}
            <div className="flex-grow overflow-y-auto p-4" style={{ backgroundColor: '#0d1117' }}>
              <div className="space-y-4">
                {messages.map((message, idx) => (
                  <div key={idx} className={`${message.type === 'user' ? 'ml-auto max-w-[80%]' : 'mr-auto max-w-[80%]'}`}>
                    <div className={`rounded-lg p-3 ${message.type === 'user' ? 'bg-neon-green/20 text-white' : 'bg-github-light text-neon-green'}`}>
                      {message.content.map((line, lineIdx) => (
                        <React.Fragment key={lineIdx}>
                          {line === '' ? <br /> : <p className="font-mono text-sm">{line}</p>}
                        </React.Fragment>
                      ))}
                    </div>
                    <p className="text-xs text-github-text mt-1">
                      {message.type === 'user' ? 'You' : 'GREENHACKER Bot'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
                {isTyping && (
                  <div className="mr-auto">
                    <div className="bg-github-light rounded-lg p-3 max-w-[80%]">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-neon-green rounded-full animate-bounce"></div>
                        <div className="h-2 w-2 bg-neon-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="h-2 w-2 bg-neon-green rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Chatbot Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-neon-green/30 bg-github-dark">
              <div className="flex items-center">
                <span className="text-neon-green font-mono mr-2">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-grow bg-transparent border-none text-white font-mono focus:outline-none text-sm"
                  placeholder="Type a message or command..."
                />
                <button
                  type="submit"
                  className="text-neon-green hover:text-white transition-colors focus:outline-none"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
