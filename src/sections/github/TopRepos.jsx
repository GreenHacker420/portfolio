"use client";
import React from "react";
import { motion } from "framer-motion";
import { Zap, ExternalLink, Star, GitFork } from "lucide-react";

export const TopRepos = ({ repos }) => {
    if (!repos || repos.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-neutral-900/40 border border-white/5 rounded-3xl p-5 md:p-6 backdrop-blur-sm h-full"
        >
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-neon-green" />
                Top Repositories
            </h3>
            <div className="space-y-3">
                {repos.map((repo, i) => (
                    <motion.a
                        key={repo.name}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="block p-3 rounded-xl bg-white/[3%] hover:bg-white/[6%] border border-transparent hover:border-neon-green/10 transition-all group"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white group-hover:text-neon-green transition-colors truncate flex items-center gap-1.5">
                                    {repo.name}
                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                </p>
                                {repo.description && (
                                    <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1">{repo.description}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-neutral-500">
                            {repo.language && (
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: repo.languageColor }} />
                                    {repo.language}
                                </span>
                            )}
                            <span className="flex items-center gap-0.5">
                                <Star className="w-3 h-3" /> {repo.stars}
                            </span>
                            <span className="flex items-center gap-0.5">
                                <GitFork className="w-3 h-3" /> {repo.forks}
                            </span>
                        </div>
                    </motion.a>
                ))}
            </div>
        </motion.div>
    );
};
