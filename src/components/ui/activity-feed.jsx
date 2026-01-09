
'use client';
import React from "react";
import { motion } from "framer-motion";
import { Code, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export const LanguageStats = ({ languages }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        className="bg-neutral-900/30 border border-white/10 rounded-2xl p-6"
    >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Code className="w-4 h-4 text-neon-green" />
            Top Languages
        </h3>
        <div className="space-y-4">
            {languages?.map((lang, idx) => (
                <div key={idx}>
                    <div className="flex justify-between text-xs text-neutral-400 mb-1">
                        <span>{lang.name}</span>
                        <span>{lang.percentage}%</span>
                    </div>
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${lang.percentage}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: lang.color }}
                        />
                    </div>
                </div>
            ))}
        </div>
    </motion.div>
);

export const ActivityFeed = ({ activities }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-neutral-900/30 border border-white/10 rounded-2xl p-6"
    >
        <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
            {activities?.map((activity, idx) => (
                <div key={idx} className="flex gap-3 items-start md:items-center">
                    <Circle className={cn("w-2 h-2 mt-1.5 md:mt-0 flex-shrink-0",
                        activity.type === 'Push' ? 'text-neon-green' :
                            activity.type === 'PR' ? 'text-purple-400' : 'text-blue-400'
                    )} />
                    <div>
                        <p className="text-sm text-neutral-200 line-clamp-1">
                            <span className="font-semibold text-white">{activity.type}</span> to <span className="opacity-80">{activity.repo}</span>
                        </p>
                        <p className="text-xs text-neutral-500">{activity.time}</p>
                    </div>
                </div>
            ))}
        </div>
    </motion.div>
);
