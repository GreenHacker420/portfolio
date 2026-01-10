'use client';
import React, { useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export const StatCard = ({ title, value, icon: Icon, delay = 0, className }) => {
    const ref = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    // Mouse tracking for tilt effect
    const x = useSpring(0, { stiffness: 200, damping: 20 });
    const y = useSpring(0, { stiffness: 200, damping: 20 });

    function handleMouseMove(e) {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    }

    const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
    const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={cn(
                "relative bg-neutral-900/40 border border-white/5 p-6 rounded-2xl flex flex-col justify-between group overflow-hidden backdrop-blur-sm hover:border-white/10 transition-colors duration-300",
                className
            )}
        >
            {/* Inner Glow Gradient */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            )} />

            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={cn(
                    "p-3 rounded-xl bg-neutral-800/50 group-hover:bg-neon-green/10 transition-colors duration-300",
                    isHovered && "ring-1 ring-neon-green/20"
                )}>
                    <Icon className={cn("w-6 h-6 text-neutral-400 group-hover:text-neon-green transition-colors duration-300")} />
                </div>
                {/* Optional delta mockup */}
                <span className="text-xs font-mono text-neon-green/80 bg-neon-green/5 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    +12%
                </span>
            </div>

            <div className="relative z-10">
                <h4 className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</h4>
                <p className="text-sm text-neutral-500 font-medium uppercase tracking-wider">{title}</p>
            </div>
        </motion.div>
    );
};
