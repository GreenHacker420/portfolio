
'use client';
import React, { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Home, User, Code, Briefcase, Mail } from "lucide-react";

export const FloatingNav = ({ className }) => {
    const { scrollYProgress } = useScroll();
    const [visible, setVisible] = useState(true);

    useMotionValueEvent(scrollYProgress, "change", (current) => {
        // Check if current is not undefined and is a number
        if (typeof current === "number") {
            let direction = current - scrollYProgress.getPrevious();

            if (scrollYProgress.get() < 0.05) {
                setVisible(true);
            } else {
                if (direction < 0) {
                    setVisible(true);
                } else {
                    setVisible(false);
                }
            }
        }
    });

    const navItems = [
        { name: "Home", link: "#hero", icon: <Home className="h-4 w-4 text-neutral-500 dark:text-white" /> },
        { name: "About", link: "#about", icon: <User className="h-4 w-4 text-neutral-500 dark:text-white" /> },
        { name: "Skills", link: "#skills", icon: <Code className="h-4 w-4 text-neutral-500 dark:text-white" /> },
        { name: "Projects", link: "#projects", icon: <Briefcase className="h-4 w-4 text-neutral-500 dark:text-white" /> },
        { name: "Contact", link: "#contact", icon: <Mail className="h-4 w-4 text-neutral-500 dark:text-white" /> },
    ];

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{
                    opacity: 1,
                    y: -100,
                }}
                animate={{
                    y: visible ? 0 : -100,
                    opacity: visible ? 1 : 0,
                }}
                transition={{
                    duration: 0.2,
                }}
                className={cn(
                    "flex max-w-fit  fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2  items-center justify-center space-x-4",
                    className
                )}
            >
                <Link href="/" className="relative flex items-center gap-2 mr-2" aria-label="Go to Homepage">
                    <Image
                        src="/logo.jpg"
                        alt="Harsh Logo"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover border border-white/10"
                    />
                </Link>
                {navItems.map((navItem, idx) => (
                    <Link
                        key={`link=${idx}`}
                        href={navItem.link}
                        aria-label={`Go to ${navItem.name} section`}
                        className={cn(
                            "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
                        )}
                    >
                        <span className="block sm:hidden">{navItem.icon}</span>
                        <span className="hidden sm:block text-sm">{navItem.name}</span>
                    </Link>
                ))}
                <Link href="https://github.com/GreenHacker420" target="_blank" className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full">
                    <span>GitHub</span>
                    <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />
                </Link>
            </motion.div>
        </AnimatePresence>
    );
};
