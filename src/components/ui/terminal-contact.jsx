import React, { useState, useEffect, useRef, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createContact } from "@/actions/contact";
import { toast } from "sonner";

export const TerminalContact = () => {
    const [history, setHistory] = useState([
        { type: 'system', content: '> INITIALIZING SECURE CONNECTION...' },
        { type: 'system', content: '> ESTABLISHED.' },
        { type: 'system', content: '> Enter Identity (Name):' }
    ]);
    const [input, setInput] = useState('');
    const [step, setStep] = useState(1); // 0: Init, 1: Name, 2: Email, 3: Message, 4: Sending, 5: Done
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const [isPending, startTransition] = useTransition();

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Focus input on click
    useEffect(() => {
        inputRef.current?.focus();
    }, [step]);


    const handleCommand = async (e) => {
        if (e.key === 'Enter') {
            const val = input.trim();
            if (!val) return;

            // Add user input to history
            const newHistory = [...history, { type: 'user', content: val }];
            setHistory(newHistory);
            setInput('');

            // Process based on step
            if (step === 1) {
                setFormData(prev => ({ ...prev, name: val }));
                setHistory(prev => [...prev, { type: 'system', content: `> Identity Confirmed: ${val}` }, { type: 'system', content: '> Enter Secure Protocol (Email):' }]);
                setStep(2);
            } else if (step === 2) {
                if (!val.includes('@')) {
                    setHistory(prev => [...prev, { type: 'error', content: '> ERROR: Invalid Protocol Syntax.' }, { type: 'system', content: '> Enter Secure Protocol (Email):' }]);
                    // Stay on step 2
                } else {
                    setFormData(prev => ({ ...prev, email: val }));
                    setHistory(prev => [...prev, { type: 'system', content: '> Protocol Validated.' }, { type: 'system', content: '> Transmit Payload (Message):' }]);
                    setStep(3);
                }
            } else if (step === 3) {
                setFormData(prev => ({ ...prev, message: val }));
                setHistory(prev => [...prev, { type: 'system', content: '> ENCRYPTING PACKET...' }]);
                setStep(4);

                // Simulate processing then submit
                startTransition(async () => {
                    setHistory(prev => [...prev, { type: 'system', content: '> UPLOADING TO MAINFRAME...' }]);

                    // Submit to Server Action
                    const finalData = { ...formData, message: val, subject: "Portfolio Contact Form", name: formData.name, email: formData.email };

                    try {
                        const result = await createContact(finalData);
                        if (result.success) {
                            setHistory(prev => [...prev, { type: 'success', content: '> TRANSMISSION COMPLETE. ACKNOWLEDGEMENT RECEIVED.' }]);
                            setStep(5);
                        } else {
                            setHistory(prev => [...prev, { type: 'error', content: `> UPLOAD FAILED: ${result.error}` }]);
                            setStep(3); // Retry message?
                        }

                    } catch (err) {
                        setHistory(prev => [...prev, { type: 'error', content: '> CRITICAL ERROR: CONNECTION LOST.' }]);
                        setStep(3);
                    }
                });
            }
        }
    };

    return (
        <div className="w-full max-w-2xl bg-black/80 border border-green-500/30 rounded-lg p-6 font-mono text-sm md:text-base shadow-[0_0_20px_rgba(0,255,0,0.1)] relative overflow-hidden backdrop-blur-sm h-[400px] flex flex-col" onClick={() => inputRef.current?.focus()}>

            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-green-500/20 pb-4 mb-4 select-none">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="text-green-500/50 text-xs">SECURE_CHANNEL_V2.0</div>
            </div>

            {/* Terminal Output */}
            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                <AnimatePresence mode="popLayout">
                    {history.map((line, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`${line.type === 'user' ? 'text-white' :
                                    line.type === 'error' ? 'text-red-500' :
                                        line.type === 'success' ? 'text-green-400' :
                                            'text-green-500'
                                }`}
                        >
                            <span className="opacity-50 mr-2">
                                {line.type === 'user' ? '$' : '>'}
                            </span>
                            {line.content}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Input Area */}
                {step < 4 && (
                    <div className="flex items-center text-white relative">
                        <span className="text-green-500 opacity-50 mr-2">$</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleCommand}
                            className="bg-transparent border-none outline-none flex-1 text-white font-mono caret-green-500"
                            autoFocus
                            spellCheck="false"
                            autoComplete="off"
                        />
                        <span className="w-2 h-4 bg-green-500 animate-pulse ml-1 inline-block" />
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
                                setHistory([
                                    { type: 'system', content: '> REBOOTING SYSTEM...' }
                                ]);
                                setStep(0);
                                setFormData({ name: '', email: '', message: '' });
                                setTimeout(() => {
                                    setHistory([
                                        { type: 'system', content: '> REBOOTING SYSTEM...' },
                                        { type: 'system', content: '> INITIALIZING SECURE CONNECTION...' },
                                        { type: 'system', content: '> ESTABLISHED.' },
                                        { type: 'system', content: '> Enter Identity (Name):' }
                                    ]);
                                    setStep(1);
                                }, 1000);
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
