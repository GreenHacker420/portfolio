"use client";
import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export const LatestWorks = ({ activities }) => {
    if (!activities || activities.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-neutral-900/40 border border-white/5 rounded-3xl p-5 md:p-6 backdrop-blur-sm h-full"
        >
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-neon-green" />
                Latest Works
            </h3>
            <div className="space-y-3">
                {activities.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/[3%] hover:bg-white/[6%] transition-colors"
                    >
                        <div className="mt-0.5 w-2 h-2 rounded-full bg-neon-green/70 flex-shrink-0 shadow-[0_0_6px_rgba(57,255,20,0.6)]" />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neon-green/10 text-neon-green border border-neon-green/20">
                                    {item.type}
                                </span>
                                <span className="text-xs text-neutral-600">{item.date}</span>
                            </div>
                            <p className="text-sm text-white font-medium mt-1 truncate">
                                in <span className="text-neon-green/80">{item.repo}</span>
                            </p>
                            <p className="text-[11px] text-neutral-500 mt-0.5 truncate">{item.message}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};
