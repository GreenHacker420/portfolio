
'use client';
import React from "react";
import { motion } from "framer-motion";
import { GitCommit, GitPullRequest, GitMerge, Star, Activity } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { GithubHeatmap } from "@/components/ui/heatmap";
import { LanguageStats, ActivityFeed } from "@/components/ui/activity-feed";

export default function GitHubAnalysis({ data }) {
    if (!data) return null;

    return (
        <section className="w-full py-20 bg-transparent relative overflow-hidden" id="github-analysis">
            {/* Ambient Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-green/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 z-10 relative">
                {/* Chapter Heading */}
                <div className="mb-16 md:mb-24">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-neon-green font-mono text-sm tracking-widest mb-2 block"
                    >
                        04. INTELLIGENCE
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold text-white mb-6"
                    >
                        Code Analysis
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-neutral-400 max-w-xl text-lg leading-relaxed"
                    >
                        A live window into my open source contributions, coding consistency, and technical milestones.
                    </motion.p>
                </div>

                {/* Top Stats Staggered */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard title="Total Commits" value={data.totalCommits || 0} icon={GitCommit} delay={0.1} />
                    <StatCard title="Pull Requests" value={data.totalPRs || 0} icon={GitPullRequest} delay={0.2} />
                    <StatCard title="Issues Solved" value={data.totalIssues || 0} icon={GitMerge} delay={0.3} />
                    <StatCard title="Stars Earned" value={data.totalStars || 0} icon={Star} delay={0.4} />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Heatmap Area - Spans 2 cols */}
                    <div className="md:col-span-2">
                        <GithubHeatmap data={data.contributions} />
                    </div>

                    {/* Right Side: Languages & Recent Timeline */}
                    <div className="space-y-8">
                        <LanguageStats languages={data.languages} />
                        <ActivityFeed activities={data.recentActivity} />
                    </div>
                </div>
            </div>
        </section>
    );
}
