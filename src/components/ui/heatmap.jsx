
'use client';
import React from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const HeatmapScale = ({ value }) => {
    let color = "bg-neutral-900";
    if (value >= 1) color = "bg-green-900/50";
    if (value >= 2) color = "bg-green-800";
    if (value >= 3) color = "bg-green-600";
    if (value >= 4) color = "bg-neon-green";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={cn("w-2 h-2 sm:w-3 sm:h-3 rounded-sm", color)}
            title={`${value} contributions`}
        />
    );
};

export const GithubHeatmap = ({ data }) => {
    if (!data) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="md:col-span-2 bg-neutral-900/30 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-neon-green" />
                    Contribution Graph
                </h3>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-neutral-900 rounded-sm"></div>
                        <div className="w-2 h-2 bg-green-900/50 rounded-sm"></div>
                        <div className="w-2 h-2 bg-green-800 rounded-sm"></div>
                        <div className="w-2 h-2 bg-green-600 rounded-sm"></div>
                        <div className="w-2 h-2 bg-neon-green rounded-sm"></div>
                    </div>
                    <span>More</span>
                </div>
            </div>

            {/* Contribution Grid */}
            <div className="flex flex-col gap-1 overflow-x-auto pb-2">
                <div className="flex gap-1 min-w-[600px]">
                    {Array.from({ length: 52 }).map((_, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                            {data.slice(weekIndex * 7, (weekIndex + 1) * 7).map((level, dayIndex) => (
                                <HeatmapScale key={`${weekIndex}-${dayIndex}`} value={level} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
