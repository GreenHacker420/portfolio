'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BorderBeam } from './border-beam';
import { cn } from '@/lib/utils';
import { Check, Terminal, Wifi } from 'lucide-react';

const TypewriterLine = ({ text, delay = 0, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let timeout;
        const startTimeout = setTimeout(() => {
            let currentIndex = 0;
            const interval = setInterval(() => {
                if (currentIndex <= text.length) {
                    setDisplayedText(text.slice(0, currentIndex));
                    currentIndex++;
                } else {
                    clearInterval(interval);
                    if (onComplete) onComplete();
                }
            }, 30); // Typing speed
            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(startTimeout);
    }, [text, delay, onComplete]);

    return <span>{displayedText}</span>;
};

export const TerminalContact = () => {
    const [step, setStep] = useState(0); // 0: Start, 1: Name, 2: Email, 3: Message, 4: Sending, 5: Success
    const [history, setHistory] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, step]);

    // Focus input on click
    const handleContainerClick = () => {
        if (step > 0 && step < 4) {
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            const value = inputValue.trim();
            if (!value) return;

            // Add user input to history
            const newHistory = [...history, { type: 'user', content: value }];
            setHistory(newHistory);
            setInputValue('');

            // Process based on current step
            if (step === 1) {
                setFormData(prev => ({ ...prev, name: value }));
                setHistory(prev => [...prev, { type: 'system', content: `> Identity confirmed: ${value}` }]);
                setTimeout(() => {
                    setHistory(prev => [...prev, { type: 'system', content: '> Enter target coordinates (Email):' }]);
                    setStep(2);
                }, 500);
            } else if (step === 2) {
                // Basic email validation
                if (!value.includes('@')) {
                    setHistory(prev => [...prev, { type: 'error', content: '> ERROR: Invalid coordinates. Protocol requires @ symbol.' }]);
                    setTimeout(() => {
                        setHistory(prev => [...prev, { type: 'system', content: '> Re-enter target coordinates (Email):' }]);
                    }, 500);
                    return;
                }
                setFormData(prev => ({ ...prev, email: value }));
                setHistory(prev => [...prev, { type: 'system', content: `> Target locked: ${value}` }]);
                setTimeout(() => {
                    setHistory(prev => [...prev, { type: 'system', content: '> Enter payload (Message):' }]);
                    setStep(3);
                }, 500);
            } else if (step === 3) {
                setFormData(prev => ({ ...prev, message: value }));
                setStep(4);

                // Simulate sending
                setHistory(prev => [...prev, { type: 'system', content: '> Encrypting payload...' }]);

                try {
                    const res = await fetch('/api/contact', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...formData, message: value }),
                    });

                    if (res.ok) {
                        setTimeout(() => {
                            setHistory(prev => [...prev, { type: 'success', content: '> Payload delivered successfully.' }]);
                            setStep(5);
                        }, 1500);
                    } else {
                        throw new Error('Transmission failed');
                    }
                } catch (err) {
                    setHistory(prev => [...prev, { type: 'error', content: '> ERROR: Transmission failed. Creating local dump.' }]);
                    setStep(5); // End anyway for demo
                }
            }
        }
    };

    // Initial boot sequence
    useEffect(() => {
        const bootSequence = async () => {
            await new Promise(r => setTimeout(r, 800));
            setHistory(prev => [...prev, { type: 'system', content: '> INITIALIZING SECURE CONNECTION...' }]);
            await new Promise(r => setTimeout(r, 800));
            setHistory(prev => [...prev, { type: 'system', content: '> ESTABLISHING UPLINK TO GREEN_HACKER_NODE...' }]);
            await new Promise(r => setTimeout(r, 800));
            setHistory(prev => [...prev, { type: 'success', content: '> CONNECTION ESTABLISHED.' }]);
            await new Promise(r => setTimeout(r, 500));
            setHistory(prev => [...prev, { type: 'system', content: '> Enter Identity (Name):' }]);
            setStep(1);
        };
        bootSequence();
    }, []);

    return (
        <div
            className="relative w-full max-w-2xl mx-auto h-[500px] bg-black/90 rounded-xl overflow-hidden border border-white/10 shadow-2xl font-mono text-sm md:text-base"
            onClick={handleContainerClick}
        >
            <BorderBeam size={300} duration={12} delay={9} borderWidth={1.5} colorFrom="#4ade80" colorTo="#22c55e" />

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    <span className="ml-2 text-xs text-neutral-400">secure_uplink.sh</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-green-500/50">
                    <Wifi className="w-3 h-3 animate-pulse" />
                    <span>ENCRYPTED</span>
                </div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 h-[calc(100%-40px)] overflow-y-auto custom-scrollbar flex flex-col gap-2">
                {history.map((line, idx) => (
                    <div key={idx} className={cn(
                        "break-words",
                        line.type === 'user' ? "text-white" :
                            line.type === 'error' ? "text-red-400" :
                                line.type === 'success' ? "text-green-400" : "text-green-500/80"
                    )}>
                        <span className="opacity-50 mr-2">
                            {line.type === 'user' ? '>' : '#'}
                        </span>
                        {line.type === 'system' ? (
                            <TypewriterLine text={line.content} />
                        ) : (
                            <span>{line.content}</span>
                        )}
                    </div>
                ))}

                {/* Input Line */}
                {step > 0 && step < 4 && (
                    <div className="flex items-center text-white">
                        <span className="opacity-50 mr-2 text-neon-green">{'>'}</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="bg-transparent border-none outline-none flex-1 text-white font-mono p-0 focus:ring-0"
                            autoFocus
                            spellCheck="false"
                            autoComplete="off"
                        />
                        <span className="w-2 h-4 bg-neon-green animate-pulse ml-1" />
                    </div>
                )}

                {/* Success Message Reset Option */}
                {step === 5 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="mt-4 pt-4 border-t border-white/10 flex gap-4"
                    >
                        <button
                            onClick={() => {
                                setHistory([]);
                                setStep(0);
                                setFormData({ name: '', email: '', message: '' });
                                setTimeout(() => {
                                    setHistory([{ type: 'system', content: '> REBOOTING SYSTEM...' }]);
                                    setTimeout(() => {
                                        setHistory([{ type: 'system', content: '> Enter Identity (Name):' }]);
                                        setStep(1);
                                    }, 1000);
                                }, 500);
                            }}
                            className="text-xs text-neutral-500 hover:text-white hover:underline cursor-pointer"
                        >
                            [RESET CONNECTION]
                        </button>
                    </motion.div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Background Grid Effect */}
            <div className="absolute inset-0 pointer-events-none z-[-1] opacity-10"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />
        </div>
    );
};
