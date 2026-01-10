'use client';
import React from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const HeatmapCell = ({ value }) => {
    let color = "bg-[#1a1a1a]";
    if (value >= 1) color = "bg-[rgba(20,83,45,0.4)]";
    if (value >= 2) color = "bg-[rgba(21,128,61,0.6)]";
    if (value >= 3) color = "bg-[rgba(34,197,94,0.8)]";
    if (value >= 4) color = "bg-[#39ff14] shadow-[0_0_10px_#39ff14]";

    return (
        <div
            className={cn("w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2px] transition-colors duration-200", color)}
            title={`${value} contributions`}
        />
    );
};

export const GithubHeatmap = ({ data }) => {
    if (!data) return null;

    return (
        <div className="md:col-span-2 bg-neutral-900/20 border border-white/5 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden w-full">
            {/* Simple Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/5 blur-[80px] rounded-full pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 relative z-10">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                        <Activity className="w-5 h-5 text-neon-green" />
                        Contribution Graph
                    </h3>
                    <p className="text-sm text-neutral-400">Consistency over the last 12 months</p>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-2 text-xs text-neutral-500 bg-black/20 p-2 rounded-lg border border-white/5">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 bg-[#1a1a1a] rounded-[2px]"></div>
                        <div className="w-2.5 h-2.5 bg-[rgba(20,83,45,0.4)] rounded-[2px]"></div>
                        <div className="w-2.5 h-2.5 bg-[rgba(21,128,61,0.6)] rounded-[2px]"></div>
                        <div className="w-2.5 h-2.5 bg-[rgba(34,197,94,0.8)] rounded-[2px]"></div>
                        <div className="w-2.5 h-2.5 bg-[#39ff14] rounded-[2px]"></div>
                    </div>
                    <span>More</span>
                </div>
            </div>

            {/* CSS Grid Heatmap - Zero JS Events */}
            <div className="w-full overflow-x-auto pb-2">
                <div className="grid grid-flow-col gap-1 w-max">
                    {Array.from({ length: 52 }).map((_, weekIndex) => (
                        <div key={weekIndex} className="grid grid-rows-7 gap-1">
                            {data.slice(weekIndex * 7, (weekIndex + 1) * 7).map((level, dayIndex) => (
                                <HeatmapCell key={dayIndex} value={level} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-neutral-500 font-mono">
                <span>Total Contributions: {data.reduce((a, b) => a + b, 0)}</span>
                <span>Learn more on Github →</span>
            </div>
        </div>
    );
};
