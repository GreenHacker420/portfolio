
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
        <section className="w-full py-20 bg-transparent relative" id="github-analysis">
            <div className="max-w-7xl mx-auto px-4 z-10 relative">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neon-green text-xs font-mono mb-4"
                    >
                        <Activity className="w-3 h-3" />
                        <span>LIVE GITHUB ACTIVITY</span>
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Code Analysis
                    </h2>
                    <p className="text-neutral-400 max-w-lg mx-auto">
                        Tracking open source contributions and coding milestones.
                    </p>
                </div>

                {/* Top Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard title="Total Commits" value={data.totalCommits || 0} icon={GitCommit} delay={0.1} />
                    <StatCard title="Pull Requests" value={data.totalPRs || 0} icon={GitPullRequest} delay={0.2} />
                    <StatCard title="Issues Solved" value={data.totalIssues || 0} icon={GitMerge} delay={0.3} />
                    <StatCard title="Stars Earned" value={data.totalStars || 0} icon={Star} delay={0.4} />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Heatmap Area */}
                    <GithubHeatmap data={data.contributions} />

                    {/* Right Side: Languages & Recent */}
                    <div className="space-y-4">
                        <LanguageStats languages={data.languages} />
                        <ActivityFeed activities={data.recentActivity} />
                    </div>
                </div>
            </div>
        </section>
    );
}
