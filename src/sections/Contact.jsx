'use client';
import React from "react";
import { motion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import { TerminalContact } from "@/components/ui/terminal-contact";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";

export default function Contact() {
    return (
        <section className="w-full py-20 bg-transparent relative antialiased min-h-screen flex flex-col justify-center items-center overflow-hidden" id="contact">
            {/* Spotlight Background */}
            {/* <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" /> */}

            <div className="max-w-7xl mx-auto px-4 w-full relative z-10 flex flex-col items-center gap-12">

                {/* Header Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-green-500 font-mono text-sm tracking-wider uppercase">System Online</span>
                    </div>

                    <h2 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                        Connect <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Protocol</span>
                    </h2>

                    <p className="text-neutral-400 text-lg max-w-lg mx-auto leading-relaxed">
                        Secure channel established. Enter your credentials to transmit data directly to the mainframe.
                    </p>
                </motion.div>

                {/* Terminal Component */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-3xl"
                >
                    <TerminalContact />
                </motion.div>

                {/* Footer / Socials */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex gap-6 mt-8"
                >
                    {[
                        { icon: Github, href: "https://github.com/GreenHacker420", label: "GitHub Profile" },
                        { icon: Instagram, href: "https://www.instagram.com/harsh_hirawat", label: "Instagram Profile" },
                        { icon: Linkedin, href: "https://www.linkedin.com/in/harsh-hirawat-b657061b7/", label: "LinkedIn Profile" },
                        { icon: Mail, href: "mailto:harsh@greenhacker.in", label: "Email Contact" }
                    ].map((social, idx) => (
                        <a
                            key={idx}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.label}
                            className="text-neutral-500 hover:text-green-500 transition-colors"
                        >
                            <social.icon className="w-6 h-6" />
                        </a>
                    ))}
                </motion.div>

            </div>

            {/* Matrix-like Background Texture */}
            <div className="absolute inset-0 z-0 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle at center, transparent 0%, black 100%)',
            }}></div>
        </section>
    );
}
