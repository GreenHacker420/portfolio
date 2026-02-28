
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, MessageCircle, X, Loader2, Bot, Terminal, Copy, Check, Trash2, FolderKanban, Cpu, BarChart3, Mail } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ============================================================
// SUGGESTED PROMPTS
// ============================================================
const SUGGESTED_PROMPTS = [
    { label: "Projects", text: "What are Harsh's best projects?", icon: FolderKanban },
    { label: "Skills", text: "What tech stack does Harsh use?", icon: Cpu },
    { label: "GitHub", text: "Analyze Harsh's GitHub activity", icon: BarChart3 },
    { label: "Contact", text: "How can I get in touch with Harsh?", icon: Mail },
];

// ============================================================
// TYPING INDICATOR
// ============================================================
const TypingIndicator = () => (
    <div className="flex gap-3 max-w-[85%]">
        <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <Bot className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="rounded-2xl px-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-tl-sm flex items-center gap-1.5">
            {[0, 1, 2].map(i => (
                <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-emerald-500/60"
                    animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                />
            ))}
        </div>
    </div>
);

// ============================================================
// CODE BLOCK WITH COPY BUTTON
// ============================================================
const CodeBlock = ({ children, className }) => {
    const [copied, setCopied] = useState(false);
    const codeStr = String(children).replace(/\n$/, '');

    const handleCopy = () => {
        navigator.clipboard.writeText(codeStr);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group/code my-2">
            <pre className={cn("bg-zinc-950 border border-emerald-500/20 rounded-lg p-3 overflow-x-auto text-xs", className)}>
                <code>{children}</code>
            </pre>
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 rounded-md bg-zinc-800/80 border border-zinc-700 text-zinc-400 hover:text-white opacity-0 group-hover/code:opacity-100 transition-all"
                aria-label="Copy code"
            >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
        </div>
    );
};

// ============================================================
// MAIN CHAT WIDGET
// ============================================================
export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'System Internal // Online. How can I assist you with this portfolio?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [threadId, setThreadId] = useState(null);
    const messagesEndRef = useRef(null);
    const [showSuggestions, setShowSuggestions] = useState(true);

    useEffect(() => {
        const storedThreadId = localStorage.getItem('chat_thread_id');
        if (storedThreadId) {
            setThreadId(storedThreadId);
            setIsLoading(true);
            fetch(`/api/chat?threadId=${storedThreadId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.messages && data.messages.length > 0) {
                        setMessages(prev => {
                            return [
                                { role: 'assistant', content: 'System Internal // Online. Welcome back.' },
                                ...data.messages
                            ];
                        });
                        setShowSuggestions(false);
                    }
                })
                .catch(err => console.error("Failed to load history:", err))
                .finally(() => setIsLoading(false));
        }
    }, []);

    const [isAtBottom, setIsAtBottom] = useState(true);
    const [isHovering, setIsHovering] = useState(false);

    const scrollToBottom = (behavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const distanceToBottom = scrollHeight - scrollTop - clientHeight;
        setIsAtBottom(distanceToBottom < 100);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages.length, isOpen]);
    useEffect(() => {
        if (!isHovering) {
            messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
        }
    }, [messages[messages.length - 1]?.content, isHovering]);

    const sendMessage = useCallback(async (messageText) => {
        if (!messageText.trim() || isLoading) return;

        setShowSuggestions(false);
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: messageText.trim() }]);
        setIsLoading(true);
        setTimeout(() => scrollToBottom(), 10);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: messageText.trim(),
                    threadId: threadId
                }),
            });

            const newThreadId = res.headers.get("X-Thread-Id");
            if (newThreadId && newThreadId !== threadId) {
                setThreadId(newThreadId);
                localStorage.setItem('chat_thread_id', newThreadId);
            }

            if (!res.ok || !res.body) {
                throw new Error(res.statusText);
            }

            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedResponse = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                accumulatedResponse += chunk;

                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMsg = { ...newMessages[newMessages.length - 1], content: accumulatedResponse };
                    newMessages[newMessages.length - 1] = lastMsg;
                    return newMessages;
                });
            }

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Error: Protocol Failure. Please retry." }]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, threadId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleClearChat = () => {
        setMessages([
            { role: 'assistant', content: 'System Internal // Online. How can I assist you with this portfolio?' }
        ]);
        setShowSuggestions(true);
        setThreadId(null);
        localStorage.removeItem('chat_thread_id');
    };

    const [dimensions, setDimensions] = useState({ width: 420, height: 600 });
    const isResizingRef = useRef(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizingRef.current) return;
            const newWidth = window.innerWidth - e.clientX - 16;
            const newHeight = window.innerHeight - e.clientY - 16;
            setDimensions({
                width: Math.max(340, Math.min(newWidth, 800)),
                height: Math.max(400, Math.min(newHeight, window.innerHeight - 40))
            });
        };

        const handleMouseUp = () => {
            isResizingRef.current = false;
            document.body.style.cursor = 'default';
        };

        if (isOpen) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isOpen]);

    // Markdown components with copy button for code blocks
    const markdownComponents = {
        pre: ({ children }) => <>{children}</>,
        code: ({ inline, children, className }) => {
            if (inline) {
                return <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-emerald-300 text-xs">{children}</code>;
            }
            return <CodeBlock className={className}>{children}</CodeBlock>;
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-4 font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.2 }}
                        style={{ width: dimensions.width, height: dimensions.height }}
                        className="bg-zinc-950/80 backdrop-blur-xl border border-emerald-500/20 rounded-2xl shadow-[0_0_50px_-12px_rgba(16,185,129,0.25)] flex flex-col overflow-hidden relative ring-1 ring-white/10"
                    >
                        {/* Resize Handle */}
                        <div
                            className="absolute top-0 left-0 w-6 h-6 cursor-nw-resize z-50 group flex items-start justify-start p-1"
                            onMouseDown={(e) => {
                                isResizingRef.current = true;
                                document.body.style.cursor = 'nw-resize';
                                e.preventDefault();
                            }}
                        >
                            <div className="w-2 h-2 rounded-full bg-emerald-500/30 group-hover:bg-emerald-500 transition-colors" />
                        </div>

                        {/* Background Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                        {/* Header */}
                        <div className="p-4 border-b border-emerald-500/10 bg-zinc-900/50 flex items-center justify-between relative z-10 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center relative group">
                                    <Bot className="h-5 w-5 text-emerald-500" />
                                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                                        AI_Assistant <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">v2.0</span>
                                    </h3>
                                    <p className="text-xs text-emerald-500/70 flex items-center gap-1.5">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                        System Online
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleClearChat}
                                    aria-label="Clear chat"
                                    className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-full h-8 w-8"
                                    title="Clear chat"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    aria-label="Close chat"
                                    className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-full h-8 w-8"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            className="flex-1 mt-auto min-h-0 overflow-y-auto p-4 space-y-6 relative z-10 scrollbar text-sm scroll-smooth"
                            style={{ overscrollBehavior: 'contain' }}
                            onScroll={handleScroll}
                            onWheel={(e) => e.stopPropagation()}
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            {messages.map((m, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={i}
                                    className={cn(
                                        "flex gap-3 max-w-[85%]",
                                        m.role === 'user' ? "ml-auto flex-row-reverse" : ""
                                    )}
                                >
                                    <div className={cn(
                                        "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 border text-[10px]",
                                        m.role === 'user'
                                            ? "bg-zinc-800 border-zinc-700 text-zinc-300"
                                            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                                    )}>
                                        {m.role === 'user' ? <Terminal className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                    </div>
                                    <div className={cn(
                                        "rounded-2xl px-4 py-2.5 text-sm shadow-sm overflow-hidden",
                                        m.role === 'user'
                                            ? "bg-zinc-100 text-zinc-900 rounded-tr-sm"
                                            : "bg-zinc-900/80 border border-zinc-800 text-zinc-300 rounded-tl-sm backdrop-blur-sm"
                                    )}>
                                        {m.role === 'user' ? (
                                            m.content
                                        ) : (
                                            <div className="prose prose-invert prose-sm max-w-none prose-p:my-1">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={markdownComponents}
                                                >
                                                    {typeof m.content === 'string' ? m.content : ''}
                                                </ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Suggested Prompts */}
                            {showSuggestions && messages.length <= 1 && !isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex flex-wrap gap-2 pt-2"
                                >
                                    {SUGGESTED_PROMPTS.map((prompt, i) => {
                                        const PromptIcon = prompt.icon;
                                        return (
                                            <motion.button
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.4 + i * 0.08 }}
                                                onClick={() => sendMessage(prompt.text)}
                                                className="px-3 py-2 text-xs rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-emerald-300/80 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-300 transition-all whitespace-nowrap flex items-center gap-1.5"
                                            >
                                                <PromptIcon className="w-3.5 h-3.5" />
                                                {prompt.label}
                                            </motion.button>
                                        );
                                    })}
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                            {isLoading && messages[messages.length - 1]?.content === '' && <TypingIndicator />}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-md relative z-10 shrink-0">
                            <form onSubmit={handleSubmit} className="flex gap-2 relative">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your command..."
                                    aria-label="Chat input"
                                    className="flex-1 bg-zinc-950/50 border-zinc-800 focus-visible:ring-emerald-500/50 text-zinc-100 placeholder:text-zinc-600 rounded-xl pr-10"
                                    disabled={isLoading}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    aria-label="Send message"
                                    disabled={isLoading || !input.trim()}
                                    className="absolute right-1 top-1 h-8 w-8 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-[0_0_10px_-3px_theme(colors.emerald.500)]"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                            <div className="text-[10px] text-center text-zinc-600 mt-2 font-mono">
                                Powered by Gemini 3 Flash
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle chat"
                className={cn(
                    "h-14 w-14 rounded-full shadow-[0_0_30px_-5px_theme(colors.emerald.500)] transition-all flex items-center justify-center border border-white/10 backdrop-blur-md",
                    isOpen
                        ? "bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-white"
                        : "bg-emerald-500 text-black hover:bg-emerald-400"
                )}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </motion.button>
        </div>
    );
}
