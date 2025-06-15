'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Send, X, Maximize2, Minimize2, HelpCircle, MessageSquare, Sparkles } from 'lucide-react';
import { trackEvent, portfolioEvents } from '@/utils/analytics';

interface Message {
  type: 'user' | 'bot';
  content: string[];
  suggestions?: string[];
  relatedFAQs?: FAQ[];
  timestamp?: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface ChatResponse {
  success: boolean;
  response?: string;
  suggestions?: string[];
  relatedFAQs?: FAQ[];
  error?: string;
}

const EnhancedChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: [
        '👋 Hi! I\'m Harsh\'s AI assistant.',
        'I can help you learn about his skills, projects, experience, and how to get in touch.',
        'Ask me anything or check out the FAQ section!'
      ],
      suggestions: [
        "What technologies does Harsh specialize in?",
        "Show me his recent projects",
        "Is he available for freelance work?",
        "How can I contact him?"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`);
  const [popularFAQs, setPopularFAQs] = useState<FAQ[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Load popular FAQs
  useEffect(() => {
    const loadFAQs = async () => {
      try {
        const response = await fetch('/api/faq?action=popular&limit=5');
        const data = await response.json();
        if (data.success) {
          setPopularFAQs(data.faqs);
        }
      } catch (error) {
        console.error('Failed to load FAQs:', error);
      }
    };

    if (isOpen) {
      loadFAQs();
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      trackEvent(portfolioEvents.CHATBOT_OPENED);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleFAQ = () => {
    setShowFAQ(!showFAQ);
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      type: 'user',
      content: [message],
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Get current page context
      const currentPage = window.location.pathname.split('/').pop() || 'home';
      
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context: currentPage,
          sessionId
        }),
      });

      const data: ChatResponse = await response.json();

      if (data.success && data.response) {
        const botMessage: Message = {
          type: 'bot',
          content: [data.response],
          suggestions: data.suggestions,
          relatedFAQs: data.relatedFAQs,
          timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, botMessage]);
        trackEvent(portfolioEvents.CHATBOT_MESSAGE_SENT);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        type: 'bot',
        content: [
          'Sorry, I\'m having trouble right now. Please try again later or check out the FAQ section for common questions.',
        ],
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleFAQClick = async (faq: FAQ) => {
    // Track FAQ view
    try {
      await fetch(`/api/faq/${faq.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'view' })
      });
    } catch (error) {
      console.error('Failed to track FAQ view:', error);
    }

    // Add FAQ as bot message
    const faqMessage: Message = {
      type: 'bot',
      content: [`**${faq.question}**`, '', faq.answer],
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, faqMessage]);
    setShowFAQ(false);
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        className="fixed bottom-8 right-8 bg-gradient-to-r from-neon-green to-neon-blue text-black h-14 w-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
      >
        <div className="relative">
          <MessageSquare size={24} />
          <Sparkles size={12} className="absolute -top-1 -right-1 text-neon-purple animate-pulse" />
        </div>
      </motion.button>

      {/* Chatbot Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed ${
              isExpanded 
                ? 'inset-4 md:inset-10' 
                : 'bottom-24 right-8 w-[380px] md:w-[420px] h-[600px]'
            } bg-github-dark border border-neon-green/30 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col backdrop-blur-sm`}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, type: "spring" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neon-green/20 bg-gradient-to-r from-github-dark to-github-light">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Terminal className="text-neon-green" size={20} />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">AI Assistant</h3>
                  <p className="text-github-text text-xs">Powered by Gemini 2.0</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleFAQ}
                  className={`p-2 rounded-lg transition-colors ${
                    showFAQ ? 'bg-neon-green/20 text-neon-green' : 'text-github-text hover:text-white hover:bg-github-light'
                  }`}
                  title="Toggle FAQ"
                >
                  <HelpCircle size={16} />
                </button>
                <button
                  onClick={toggleExpanded}
                  className="text-github-text hover:text-white hover:bg-github-light p-2 rounded-lg transition-colors"
                  title={isExpanded ? "Minimize" : "Expand"}
                >
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  onClick={toggleChat}
                  className="text-github-text hover:text-white hover:bg-github-light p-2 rounded-lg transition-colors"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex overflow-hidden">
              {/* FAQ Sidebar */}
              <AnimatePresence>
                {showFAQ && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '40%', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="border-r border-neon-green/20 bg-github-light/50 overflow-y-auto"
                  >
                    <div className="p-3">
                      <h4 className="text-white font-medium text-sm mb-3">Popular Questions</h4>
                      <div className="space-y-2">
                        {popularFAQs.map((faq) => (
                          <button
                            key={faq.id}
                            onClick={() => handleFAQClick(faq)}
                            className="w-full text-left p-2 rounded-lg text-xs text-github-text hover:text-white hover:bg-github-dark/50 transition-colors"
                          >
                            {faq.question}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Messages */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${
                        message.type === 'user' 
                          ? 'bg-neon-green text-black' 
                          : 'bg-github-light text-white'
                      } rounded-lg p-3 shadow-lg`}>
                        {message.content.map((line, lineIndex) => (
                          <div key={lineIndex} className={`${lineIndex > 0 ? 'mt-1' : ''} text-sm`}>
                            {line.startsWith('**') && line.endsWith('**') ? (
                              <strong>{line.slice(2, -2)}</strong>
                            ) : (
                              line
                            )}
                          </div>
                        ))}
                        
                        {/* Suggestions */}
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-3 space-y-1">
                            {message.suggestions.map((suggestion, suggestionIndex) => (
                              <button
                                key={suggestionIndex}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="block w-full text-left text-xs bg-github-dark/20 hover:bg-github-dark/40 text-github-text hover:text-white px-2 py-1 rounded transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-github-light text-white rounded-lg p-3 shadow-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="p-4 border-t border-neon-green/20 bg-github-light/30">
                  <div className="flex items-center space-x-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1 bg-github-dark border border-github-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neon-green transition-colors"
                      placeholder="Ask me anything about Harsh..."
                      disabled={isTyping}
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isTyping}
                      className="bg-neon-green text-black p-2 rounded-lg hover:bg-neon-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EnhancedChatbot;
