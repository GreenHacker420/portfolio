
'use client';
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Github, Instagram, Linkedin, CheckCircle, Smartphone, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Simple Label component
const Label = ({ children, className, htmlFor }) => {
    return (
        <label htmlFor={htmlFor} className={cn("text-sm font-medium text-neutral-300 mb-2 block", className)}>
            {children}
        </label>
    );
};

// Simple Input component
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm ring-offset-neutral-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green/50 focus-visible:border-neon-green disabled:cursor-not-allowed disabled:opacity-50 text-white shadow-input",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = "Input";

// Simple TextArea component
const TextArea = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                "flex min-h-[80px] w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm ring-offset-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green/50 focus-visible:border-neon-green disabled:cursor-not-allowed disabled:opacity-50 text-white shadow-input",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
TextArea.displayName = "TextArea";


export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        projectType: "",
        message: ""
    });
    const [status, setStatus] = useState("idle"); // idle, submitting, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setFormData({ name: "", email: "", projectType: "", message: "" });
                setTimeout(() => setStatus("idle"), 3000);
            } else {
                console.error("Form Error:", data);
                setStatus("error"); // You might want to handle error state visually
                setTimeout(() => setStatus("idle"), 3000);
            }
        } catch (error) {
            console.error("Submission Error:", error);
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    return (
        <section className="w-full py-20 bg-transparent relative" id="contact">
            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 relative z-10">
                {/* Left Side: Info & Hire Me CTA */}
                <div className="flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="text-green-500 font-mono text-sm tracking-wider uppercase">Available for Work</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Let's build something <span className="text-neon-green">extraordinary.</span>
                        </h2>

                        <p className="text-neutral-400 text-lg mb-8 max-w-lg leading-relaxed">
                            I'm currently accepting new projects. Whether you have a question, a proposal, or just want to say hi, I'll try my best to get back to you!
                        </p>

                        <div className="flex flex-col gap-4 text-neutral-300 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800">
                                    <Mail className="w-5 h-5 text-neon-green" />
                                </div>
                                <Link href="mailto:harsh@greenhacker.in"><span>harsh@greenhacker.in</span></Link>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800">
                                    <Smartphone className="w-5 h-5 text-neon-green" />
                                </div>
                                <Link href="tel:+919479733955"><span>+91 9479733955</span></Link>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {[
                                { icon: Github, href: "https://github.com/GreenHacker420" },
                                { icon: Instagram, href: "https://www.instagram.com/harsh_hirawat" },
                                { icon: Linkedin, href: "https://www.linkedin.com/in/harsh-hirawat-b657061b7/" }
                            ].map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-neutral-900 rounded-full border border-neutral-800 text-white hover:bg-neon-green hover:text-black transition-all hover:scale-110"
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right Side: Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                        {/* Glow effect behind form */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-60 h-60 bg-neon-green/20 rounded-full blur-[80px] pointer-events-none"></div>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstname">First Name</Label>
                                    <Input
                                        id="firstname"
                                        placeholder="John"
                                        value={formData.name.split(' ')[0] || ''}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value + ' ' + (formData.name.split(' ')[1] || '') })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastname">Last Name</Label>
                                    <Input
                                        id="lastname"
                                        placeholder="Doe"
                                        value={formData.name.split(' ')[1] || ''}
                                        onChange={(e) => setFormData({ ...formData, name: (formData.name.split(' ')[0] || '') + ' ' + e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="projectType">Project Type (Optional)</Label>
                                <Input
                                    id="projectType"
                                    placeholder="Web Development, Design, AI..."
                                    value={formData.projectType}
                                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <TextArea
                                    id="message"
                                    placeholder="Tell me about your project..."
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'submitting' || status === 'success'}
                                className={cn(
                                    "w-full py-4 rounded-lg font-bold text-black transition-all flex items-center justify-center gap-2",
                                    status === 'success' ? "bg-green-500" : "bg-white hover:bg-neon-green"
                                )}
                            >
                                {status === 'submitting' ? (
                                    <span className="animate-pulse">Sending...</span>
                                ) : status === 'success' ? (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Message Sent!
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
