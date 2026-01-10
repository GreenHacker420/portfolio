'use client';
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const HeatmapCell = ({ value, index }) => {
    const [hover, setHover] = useState(false);

    let color = "bg-neutral-900/50";
    if (value >= 1) color = "bg-green-900/40";
    if (value >= 2) color = "bg-green-700/60";
    if (value >= 3) color = "bg-green-500/80";
    if (value >= 4) color = "bg-neon-green shadow-sm shadow-neon-green/50";

    return (
        <div className="relative group"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(index * 0.002, 1), type: 'spring', stiffness: 300, damping: 20 }}
                className={cn(
                    "w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm transition-all duration-300",
                    color,
                    hover && "scale-125 z-10 ring-2 ring-black ring-offset-1 ring-offset-transparent"
                )}
            />
            {/* Tooltip */}
            {hover && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-neutral-800 text-white text-xs rounded-md whitespace-nowrap z-50 shadow-xl border border-white/10 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
                    <span className="font-semibold text-neon-green">{value === 0 ? "No" : value}</span> contributions
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800" />
                </div>
            )}
        </div>
    );
};

export const GithubHeatmap = ({ data }) => {
    if (!data) return null;

    // Generate recent 12 months context
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="md:col-span-2 bg-neutral-900/20 border border-white/5 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group"
        >
            {/* Subtle Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/5 blur-[80px] rounded-full pointer-events-none transition-opacity duration-500 group-hover:bg-neon-green/10" />

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 relative z-10">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                        <Activity className="w-5 h-5 text-neon-green" />
                        Contribution Graph
                    </h3>
                    <p className="text-sm text-neutral-400">Consistency over the last 12 months</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-500 bg-black/20 p-2 rounded-lg border border-white/5">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 bg-neutral-900/50 rounded-sm"></div>
                        <div className="w-2.5 h-2.5 bg-green-900/40 rounded-sm"></div>
                        <div className="w-2.5 h-2.5 bg-green-700/60 rounded-sm"></div>
                        <div className="w-2.5 h-2.5 bg-green-500/80 rounded-sm"></div>
                        <div className="w-2.5 h-2.5 bg-neon-green rounded-sm"></div>
                    </div>
                    <span>More</span>
                </div>
            </div>

            {/* Contribution Grid */}
            <div className="flex gap-1 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] cursor-grab active:cursor-grabbing">
                {/* Week/Month Labels could go here if we had date mapping, simple grid for now */}
                <div className="flex gap-1 min-w-max px-2">
                    {Array.from({ length: 52 }).map((_, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                            {data.slice(weekIndex * 7, (weekIndex + 1) * 7).map((level, dayIndex) => (
                                <HeatmapCell key={`${weekIndex}-${dayIndex}`} value={level} index={weekIndex * 7 + dayIndex} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-neutral-500 font-mono">
                <span>Total Contributions: {data.reduce((a, b) => a + b, 0)}</span>
                <span>Learn more on Github →</span>
            </div>
        </motion.div>
    );
};
