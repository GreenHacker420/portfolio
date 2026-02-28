'use client';
import React, { useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export const StatCard = ({ title, value, icon: Icon, delay = 0, className, description }) => {
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
                "relative bg-gradient-to-b from-neutral-900/60 to-neutral-950/90 border border-white/5 p-6 rounded-3xl flex flex-col justify-between group overflow-hidden backdrop-blur-xl hover:border-neon-green/30 transition-all duration-500 shadow-2xl hover:shadow-[0_0_40px_-10px_rgba(57,255,20,0.15)]",
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
                {/* Optional description or delta */}
                {/* <span className="text-xs font-mono text-neon-green/80 bg-neon-green/5 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    +12%
                </span> */}
                {/* Use value or description if provided */}
            </div>

            <div className="relative z-10 flex flex-col pt-2">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h4 className="text-4xl xl:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">{value}</h4>
                </div>
                {description && (
                    <p className="text-[10px] sm:text-xs text-neutral-500/80 mt-2 flex flex-row items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-green/70 inline-block shadow-[0_0_8px_rgba(57,255,20,0.8)]" />
                        {description}
                    </p>
                )}
            </div>
        </motion.div>
    );
};
