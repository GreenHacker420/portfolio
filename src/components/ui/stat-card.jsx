
'use client';
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const StatCard = ({ title, value, icon: Icon, delay = 0, className }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className={cn(
            "bg-neutral-900/50 border border-white/10 p-4 rounded-xl flex items-center gap-4 hover:border-neon-green/50 transition-colors group",
            className
        )}
    >
        <div className="p-3 bg-neutral-800 rounded-lg group-hover:bg-neon-green/10 transition-colors">
            <Icon className="w-5 h-5 text-neon-green" />
        </div>
        <div>
            <h4 className="text-2xl font-bold text-white">{value}</h4>
            <p className="text-xs text-neutral-400 uppercase tracking-wider">{title}</p>
        </div>
    </motion.div>
);
