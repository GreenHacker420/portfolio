'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  MessageSquare, 
  Maximize2, 
  Minimize2, 
  X, 
  Send,
  Command,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useCLIHistory } from '@/hooks/useCLIHistory';
import { useCommandCompletion } from '@/hooks/useCommandCompletion';
import { CLIResponse, CLIContext, CLIState } from '@/types/cli';
import { 
  formatCLIOutput, 
  parseCommandLine, 
  generateSessionId, 
  formatExecutionTime,
  trackCLIEvent,
  getOptimalCLIDimensions,
  isMobileEnvironment
} from '@/utils/cliHelpers';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface CLIMessage {
  id: string;
  type: 'input' | 'output' | 'system';
  content: string[];
  timestamp: string;
  responseType?: CLIResponse['type'];
  executionTime?: number;
}

const CLIChatbot: React.FC = () => {
  // State management
  const [state, setState] = useState<CLIState>({
    isOpen: false,
    isExpanded: false,
    currentInput: '',
    history: [],
    historyIndex: -1,
    completions: [],
    showCompletions: false,
    isProcessing: false,
    sessionId: generateSessionId(),
    mode: 'command'
  });

  const [messages, setMessages] = useState<CLIMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Custom hooks
  const { 
    history, 
    addToHistory, 
    navigateHistory, 
    clearHistory 
  } = useCLIHistory();

  const {
    completions,
    selectedIndex,
    showCompletions,
    getCompletions,
    navigateCompletions,
    hideCompletions,
    applyCompletion
  } = useCommandCompletion();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when CLI opens
  useEffect(() => {
    if (state.isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.isOpen]);

  // Initialize with welcome message
  useEffect(() => {
    if (state.isOpen && messages.length === 0) {
      const newConversationId = `conv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setConversationId(newConversationId);

      const welcomeMessage: CLIMessage = {
        id: `welcome-${Date.now()}`,
        type: 'system',
        content: [
          '🚀 Welcome to GREENHACKER CLI v1.0',
          '═══════════════════════════════════',
          '',
          '💡 Ask anything about the portfolio or type "help" for shortcuts',
          '💡 Use Tab for auto-completion and ↑/↓ for command history',
          '',
          'Ready and listening...'
        ],
        timestamp: new Date().toISOString(),
        responseType: 'info'
      };
      setMessages([welcomeMessage]);
    }
  }, [state.isOpen, messages.length]);

  // Handle CLI context
  const getCLIContext = useCallback((): CLIContext => ({
    currentPage: typeof window !== 'undefined' ? window.location.pathname : '/',
    sessionId: state.sessionId,
    conversationId,
    conversationHistory,
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown',
    ipAddress: 'client',
    history,
    suggestions: []
  }), [state.sessionId, history, conversationId, conversationHistory]);

  // Toggle CLI visibility
  const toggleCLI = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
    
    if (!state.isOpen) {
      trackCLIEvent({
        type: 'command_executed',
        command: 'open',
        timestamp: new Date().toISOString(),
        sessionId: state.sessionId,
        context: getCLIContext().currentPage
      });
    }
  }, [state.isOpen, state.sessionId, getCLIContext]);

  // Toggle expanded mode
  const toggleExpanded = useCallback(() => {
    setState(prev => ({ ...prev, isExpanded: !prev.isExpanded }));
  }, []);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setState(prev => ({ ...prev, currentInput: value }));
    
    // Get completions if not empty
    if (value.trim()) {
      getCompletions(value, getCLIContext());
    } else {
      hideCompletions();
    }
  }, [getCompletions, getCLIContext, hideCompletions]);

  // Handle key press events
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (showCompletions && completions.length > 0) {
          const completion = applyCompletion();
          if (completion) {
            setState(prev => ({ ...prev, currentInput: completion }));
          }
        } else {
          handleSubmit();
        }
        break;

      case 'Tab':
        e.preventDefault();
        if (showCompletions && completions.length > 0) {
          const completion = applyCompletion();
          if (completion) {
            setState(prev => ({ ...prev, currentInput: completion }));
          }
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (showCompletions) {
          navigateCompletions('up');
        } else {
          const historyCommand = navigateHistory('up');
          if (historyCommand !== null) {
            setState(prev => ({ ...prev, currentInput: historyCommand }));
          }
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (showCompletions) {
          navigateCompletions('down');
        } else {
          const historyCommand = navigateHistory('down');
          if (historyCommand !== null) {
            setState(prev => ({ ...prev, currentInput: historyCommand }));
          }
        }
        break;

      case 'Escape':
        e.preventDefault();
        hideCompletions();
        break;

      case 'c':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          setState(prev => ({ ...prev, currentInput: '' }));
          hideCompletions();
        }
        break;

      case 'l':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          handleClear();
        }
        break;
    }
  }, [
    showCompletions, 
    completions, 
    applyCompletion, 
    navigateCompletions, 
    navigateHistory, 
    hideCompletions
  ]);

  // Handle command submission
  const handleSubmit = useCallback(async () => {
    const command = state.currentInput.trim();
    if (!command) return;

    // Add input message
    const inputMessage: CLIMessage = {
      id: `input-${Date.now()}`,
      type: 'input',
      content: [`$ ${command}`],
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, inputMessage]);
    setState(prev => ({ ...prev, currentInput: '', isProcessing: true }));
    hideCompletions();

    try {
      setConversationHistory(prev => [...prev, command]);

      // Local special commands
      const lower = command.toLowerCase();
      if (lower === 'clear') { handleClear(); return; }
      if (lower === 'exit') { handleExit(); return; }

      // Mode switching handled locally for instant UX
      if (lower === 'chat') {
        setState(prev => ({ ...prev, mode: 'chat' }));
        setMessages(prev => [...prev, {
          id: `sys-${Date.now()}`,
          type: 'system',
          content: ['🤖 Switched to AI chat mode. Ask anything!'],
          timestamp: new Date().toISOString(),
          responseType: 'info'
        }]);
        return;
      }
      if (lower === 'cmd') {
        setState(prev => ({ ...prev, mode: 'command' }));
        setMessages(prev => [...prev, {
          id: `sys-${Date.now()}`,
          type: 'system',
          content: ['⌨️ Switched to command mode. Type `help` for commands.'],
          timestamp: new Date().toISOString(),
          responseType: 'info'
        }]);
        return;
      }

      // Parse for routing decision
      const { command: cmd, args } = parseCommandLine(command);

      // Known command set; everything else or chat mode goes to AI
      const KNOWN = new Set([
        'help','ls','about','skills','projects','contact','faq','experience','github','status',
        'whoami','date','echo','history','version'
      ]);

      const questionWords = ['how', 'what', 'when', 'where', 'why', 'who', 'explain', 'tell me', 'show', 'describe'];
      const shouldUseAI =
        state.mode === 'chat' ||
        lower.startsWith('ask ') ||
        !KNOWN.has(cmd) ||
        questionWords.some(word => lower.includes(word));

      if (shouldUseAI) {
        const prompt = lower.startsWith('ask ') ? command.slice(4).trim() : command;
        const aiRes = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: prompt,
            context: `CLI terminal on ${getCLIContext().currentPage} • session ${state.sessionId}`,
            conversationId,
            history: conversationHistory.slice(-6)
          })
        });
        const aiData = await aiRes.json();
        const outputMessage: CLIMessage = {
          id: `output-${Date.now()}`,
          type: 'output',
          content: [aiData?.response || 'I could not generate a response.'],
          timestamp: new Date().toISOString(),
          responseType: aiRes.ok ? 'ai' : 'error'
        };
        setMessages(prev => [...prev, outputMessage]);
        setConversationHistory(prev => [...prev, aiData?.response || '']);
        // save to history as an AI query
        addToHistory(cmd, args, {
          type: aiRes.ok ? 'ai' : 'error',
          output: outputMessage.content,
          metadata: { executionTime: 0 }
        } as unknown as CLIResponse);
        return;
      }

      // Otherwise, treat as a normal CLI command via /api/cli
      const response = await fetch('/api/cli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, context: getCLIContext(), sessionId: state.sessionId })
      });

      const data: CLIResponse = await response.json();
      const outputMessage: CLIMessage = {
        id: `output-${Date.now()}`,
        type: 'output',
        content: formatCLIOutput(data),
        timestamp: new Date().toISOString(),
        responseType: data.type,
        executionTime: data.metadata?.executionTime
      };
      setMessages(prev => [...prev, outputMessage]);
      addToHistory(cmd, args, data);

      if (data.metadata?.special === 'mode_switch') {
        setState(prev => ({ ...prev, mode: data.metadata?.mode === 'chat' ? 'chat' : 'command' }));
      }
      if (data.metadata?.special === 'exit') {
        setTimeout(() => { setState(prev => ({ ...prev, isOpen: false })); }, 1000);
      }
    } catch (error) {
      console.error('CLI command error:', error);
      
      const errorMessage: CLIMessage = {
        id: `error-${Date.now()}`,
        type: 'output',
        content: [
          '❌ Error executing command',
          'Please check your connection and try again.',
          'Type "help" for available commands.'
        ],
        timestamp: new Date().toISOString(),
        responseType: 'error'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [state.currentInput, state.sessionId, getCLIContext, addToHistory, hideCompletions]);

  // Handle clear command
  const handleClear = useCallback(() => {
    setMessages([]);
    setConversationHistory([]);
    setConversationId(`conv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
    setState(prev => ({ ...prev, isProcessing: false }));
  }, []);

  // Handle exit command
  const handleExit = useCallback(() => {
    const exitMessage: CLIMessage = {
      id: `exit-${Date.now()}`,
      type: 'output',
      content: ['👋 Thanks for using GREENHACKER CLI!', 'Closing interface...'],
      timestamp: new Date().toISOString(),
      responseType: 'success'
    };

    setMessages(prev => [...prev, exitMessage]);
    
    setTimeout(() => {
      setState(prev => ({ ...prev, isOpen: false }));
    }, 1000);
  }, []);

  // Get optimal dimensions
  const dimensions = getOptimalCLIDimensions();
  const isMobile = isMobileEnvironment();

  return (
    <>
      {/* CLI Toggle Button */}
      <motion.button
        className="fixed bottom-8 right-8 bg-gradient-to-r from-neon-green to-neon-blue text-black h-14 w-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleCLI}
        aria-label="Open CLI Terminal"
      >
        <div className="relative">
          <Terminal size={24} />
          <Command size={12} className="absolute -top-1 -right-1 text-neon-purple animate-pulse" />
        </div>
      </motion.button>

      {/* CLI Interface */}
      <AnimatePresence>
        {state.isOpen && (
          <motion.div
            ref={containerRef}
            className={`fixed ${
              state.isExpanded 
                ? 'inset-4 md:inset-10' 
                : isMobile
                ? 'inset-4'
                : `bottom-24 right-8`
            } bg-github-dark border border-neon-green/30 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col backdrop-blur-sm`}
            style={!state.isExpanded && !isMobile ? {
              width: dimensions.width,
              height: dimensions.height
            } : {}}
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
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="text-neon-green font-mono text-sm font-bold">
                    GREENHACKER CLI
                  </h3>
                  <p className="text-xs text-gray-400">
                    Mode: {state.mode === 'command' ? 'Command' : 'Chat'} | Session: {state.sessionId.slice(-8)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleExpanded}
                  className="text-gray-400 hover:text-neon-green transition-colors p-1"
                  aria-label={state.isExpanded ? "Minimize" : "Maximize"}
                >
                  {state.isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  onClick={toggleCLI}
                  className="text-gray-400 hover:text-red-400 transition-colors p-1"
                  aria-label="Close CLI"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm bg-github-dark">
              {messages.map((message) => (
                <div key={message.id} className="space-y-1">
                  {message.content.map((line, index) => (
                    <div key={index} className="whitespace-pre-wrap">
                      {message.type === 'input' ? (
                        <div className="text-neon-green">{line}</div>
                      ) : (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: ({ href, children }) => (
                              <a href={href as string} target="_blank" rel="noreferrer" className="underline text-neon-blue hover:text-neon-green">
                                {children}
                              </a>
                            ),
                            code: ({ children }) => (
                              <code className="px-1 py-0.5 rounded bg-github-light text-neon-purple font-mono">
                                {children as React.ReactNode}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className="p-3 rounded bg-github-light overflow-x-auto text-white">
                                {children as React.ReactNode}
                              </pre>
                            ),
                            li: ({ children }) => (
                              <li className="ml-4 list-disc">{children}</li>
                            ),
                            strong: ({ children }) => (
                              <strong className="text-white">{children}</strong>
                            ),
                            p: ({ children }) => (
                              <p
                                className={`${
                                  message.responseType === 'error'
                                    ? 'text-red-400'
                                    : message.responseType === 'success'
                                    ? 'text-neon-green'
                                    : message.responseType === 'warning'
                                    ? 'text-yellow-400'
                                    : message.responseType === 'info'
                                    ? 'text-neon-blue'
                                    : message.responseType === 'ai'
                                    ? 'text-neon-purple'
                                    : 'text-white'
                                }`}
                              >
                                {children}
                              </p>
                            ),
                          }}
                        >
                          {line}
                        </ReactMarkdown>
                      )}
                    </div>
                  ))}
                  {message.executionTime && (
                    <div className="text-xs text-gray-500">
                      Executed in {formatExecutionTime(message.executionTime)}
                    </div>
                  )}
                </div>
              ))}
              
              {state.isProcessing && (
                <div className="flex items-center space-x-2 text-neon-blue">
                  <div className="animate-spin">⚡</div>
                  <span>Processing command...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Completions */}
            {showCompletions && completions.length > 0 && (
              <div className="border-t border-neon-green/20 bg-github-light max-h-32 overflow-y-auto">
                {completions.map((completion, index) => (
                  <div
                    key={index}
                    className={`px-4 py-2 text-sm font-mono cursor-pointer ${
                      index === selectedIndex
                        ? 'bg-neon-green/20 text-neon-green'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => {
                      setState(prev => ({ ...prev, currentInput: completion.text }));
                      hideCompletions();
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{completion.text}</span>
                      {completion.description && (
                        <span className="text-xs text-gray-500">{completion.description}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-neon-green/20 bg-github-light">
              <div className="flex items-center space-x-2">
                <span className="text-neon-green font-mono">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={state.currentInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  className="flex-1 bg-transparent border-none text-white font-mono focus:outline-none text-sm placeholder-gray-500"
                  placeholder={state.mode === 'command' ? "Type a command..." : "Chat with AI..."}
                  disabled={state.isProcessing}
                />
                <button
                  onClick={handleSubmit}
                  disabled={state.isProcessing || !state.currentInput.trim()}
                  className="text-neon-green hover:text-white transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Execute command"
                >
                  <Send size={16} />
                </button>
              </div>
              
              {/* Quick help */}
              <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                <span>
                  Tab: complete | ↑↓: history | Ctrl+L: clear | Ctrl+C: cancel
                </span>
                <div className="flex items-center space-x-2">
                  <HelpCircle size={12} />
                  <span>Type "help" for commands</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CLIChatbot;
