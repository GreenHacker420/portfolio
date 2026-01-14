'use client';
import React from "react";
import { motion } from "framer-motion";
import { Code, Circle, GitCommit, GitPullRequest, GitMerge, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export const LanguageStats = ({ languages }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        className="bg-neutral-900/20 border border-white/5 rounded-3xl p-8 backdrop-blur-sm"
    >
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Code className="w-5 h-5 text-neon-green" />
            Top Languages
        </h3>
        <div className="space-y-5">
            {languages?.map((lang, idx) => (
                <div key={idx} className="group">
                    <div className="flex justify-between text-xs text-neutral-400 mb-2">
                        <span className="font-medium text-white group-hover:text-neon-green transition-colors">{lang.name}</span>
                        <span>{lang.percentage}%</span>
                    </div>
                    <div className="w-full bg-neutral-800/50 h-2 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${lang.percentage}%` }}
                            transition={{ duration: 1.5, delay: 0.2 + idx * 0.1, ease: "easeOut" }}
                            className="h-full rounded-full relative"
                            style={{ backgroundColor: lang.color }}
                        >
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    </div>
                </div>
            ))}
        </div>
    </motion.div>
);

const ActivityIcon = ({ type }) => {
    switch (type) {
        case 'Push': return <GitCommit className="w-3.5 h-3.5" />;
        case 'PR': return <GitPullRequest className="w-3.5 h-3.5" />;
        case 'Issue': return <GitMerge className="w-3.5 h-3.5" />;
        case 'Star': return <Star className="w-3.5 h-3.5" />;
        default: return <Circle className="w-2 h-2" />;
    }
};

const ActivityColor = (type) => {
    switch (type) {
        case 'Push': return 'bg-neon-green/10 text-neon-green border-neon-green/20';
        case 'PR': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
        case 'Issue': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
        case 'Star': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
};

export const ActivityFeed = ({ activities }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-neutral-900/20 border border-white/5 rounded-3xl p-8 backdrop-blur-sm"
    >
        <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>
        <div className="space-y-0 relative border-l border-white/10 ml-4 pb-2">
            {activities?.map((activity, idx) => (
                <div key={idx} className="mb-8 last:mb-0 ml-8 relative group">
                    {/* Timeline Dot */}
                    <div className={cn(
                        "absolute -left-[41px] top-1 w-5 h-5 rounded-full border flex items-center justify-center bg-zinc-950 z-10",
                        ActivityColor(activity.type).split(' ')[2], // border color
                    )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", activity.type === 'Push' ? 'bg-neon-green' : 'bg-white')} />
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider",
                                ActivityColor(activity.type)
                            )}>
                                {activity.type}
                            </span>
                            <span className="text-xs text-neutral-500">{activity.time}</span>
                        </div>
                        <p className="text-sm text-neutral-300 group-hover:text-white transition-colors">
                            <span className="opacity-80">in</span> <span className="font-semibold">{activity.repo}</span>
                        </p>
                        <p className="text-xs text-neutral-500 mt-1 font-mono opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1 group-hover:translate-y-0 duration-300">
                            {activity.message}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </motion.div>
);
