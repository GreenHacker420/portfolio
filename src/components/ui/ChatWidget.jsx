
"use client";

import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, X, Loader2, Sparkles, Bot, Terminal } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'System Internal // Online. How can I assist you with this portfolio?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [threadId, setThreadId] = useState(null);
    const messagesEndRef = useRef(null);

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
                    }
                })
                .catch(err => console.error("Failed to load history:", err))
                .finally(() => setIsLoading(false));
        }
    }, []);

    const [isAtBottom, setIsAtBottom] = useState(true);

    const scrollToBottom = (behavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const distanceToBottom = scrollHeight - scrollTop - clientHeight;
        setIsAtBottom(distanceToBottom < 50);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages.length, isOpen]);
    useEffect(() => {
        if (isAtBottom) {
            messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
        }
    }, [messages[messages.length - 1]?.content]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            // Initiate the request
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    threadId: threadId
                }),
            });

            // Handle Thread ID from Header
            const newThreadId = res.headers.get("X-Thread-Id");
            if (newThreadId && newThreadId !== threadId) {
                setThreadId(newThreadId);
                localStorage.setItem('chat_thread_id', newThreadId);
            }

            if (!res.ok || !res.body) {
                throw new Error(res.statusText);
            }

            // Prepare for streaming response
            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedResponse = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                accumulatedResponse += chunk;

                // Update the last message (assistant's placeholder) with new accumulated text
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    lastMsg.content = accumulatedResponse;
                    return newMessages;
                });
            }

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Error: Protocol Failure. Please retry." }]);
        } finally {
            setIsLoading(false);
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
                        className="w-[350px] sm:w-[400px] h-[550px] bg-zinc-950/80 backdrop-blur-xl border border-emerald-500/20 rounded-2xl shadow-[0_0_50px_-12px_rgba(16,185,129,0.25)] flex flex-col overflow-hidden relative ring-1 ring-white/10"
                    >
                        {/* Cyber Grid Background */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                        {/* Header */}
                        <div className="p-4 border-b border-emerald-500/10 bg-zinc-900/50 flex items-center justify-between relative z-10">
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
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-full"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <div
                            className="flex-1 mt-auto min-h-0 overflow-y-auto p-4 space-y-6 relative z-10 scrollbar text-sm scroll-smooth"
                            onScroll={handleScroll}
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
                                            <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-emerald-500/20">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                >
                                                    {typeof m.content === 'string' ? m.content : ''}
                                                </ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                            {isLoading && (
                                <div className="flex gap-3 max-w-[85%]">
                                    <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                                        <Loader2 className="h-4 w-4 text-emerald-500 animate-spin" />
                                    </div>
                                    <div className="rounded-2xl px-4 py-2.5 text-sm bg-zinc-900/80 border border-zinc-800 text-zinc-400 rounded-tl-sm opacity-70">
                                        Processing...
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-md relative z-10">
                            <form onSubmit={handleSubmit} className="flex gap-2 relative">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your command..."
                                    className="flex-1 bg-zinc-950/50 border-zinc-800 focus-visible:ring-emerald-500/50 text-zinc-100 placeholder:text-zinc-600 rounded-xl pr-10"
                                    disabled={isLoading}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
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
