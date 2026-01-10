"use client";
import React, { useRef, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GitCommit, GitPullRequest, GitMerge, Star, Activity } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { LanguageStats, ActivityFeed } from "@/components/ui/activity-feed";

const GithubHeatmapFast = ({ data }) => {
    if (!data) return null;

    const [hoveredData, setHoveredData] = useState(null);

    // Configuration
    const cellSize = 11;
    const cellGap = 4;
    const cellPitch = cellSize + cellGap;
    const weeks = 52;
    const daysPerWeek = 7;
    const width = weeks * cellPitch;
    const height = daysPerWeek * cellPitch;

    // Precompute colors to avoid calc on render
    const colors = useMemo(() => {
        return data.map((value) => {
            if (value >= 4) return "#39ff14";
            if (value >= 3) return "rgba(34,197,94,0.8)";
            if (value >= 2) return "rgba(21,128,61,0.6)";
            if (value >= 1) return "rgba(20,83,45,0.4)";
            return "#1a1a1a";
        });
    }, [data]);

    // Event Delegation: Single listener for 365 cells
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate index from coordinates (faster than finding DOM nodes)
        const col = Math.floor(x / cellPitch);
        const row = Math.floor(y / cellPitch);

        if (col >= 0 && col < weeks && row >= 0 && row < daysPerWeek) {
            const index = col * daysPerWeek + row;
            if (index < data.length) {
                setHoveredData({
                    value: data[index],
                    x: e.clientX, // Global for fixed tooltip
                    y: e.clientY,
                    date: new Date(Date.now() - (data.length - index - 1) * 86400000)
                });
                return;
            }
        }
        setHoveredData(null);
    };

    return (
        <div className="md:col-span-2 bg-neutral-900/20 border border-white/5 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden w-full group">
            {/* Subtle Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/5 blur-[80px] rounded-full pointer-events-none transition-opacity duration-500 group-hover:bg-neon-green/10" />

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

            <div className="w-full overflow-x-auto overflow-y-hidden pb-4">
                <svg
                    width="100%"
                    height={height}
                    viewBox={`0 0 ${width} ${height}`}
                    preserveAspectRatio="xMinYMin meet"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setHoveredData(null)}
                    className="cursor-crosshair"
                >
                    {/* Render all rects statically - NO individual events */}
                    {data.map((_, i) => {
                        const col = Math.floor(i / daysPerWeek);
                        const row = i % daysPerWeek;
                        return (
                            <rect
                                key={i}
                                x={col * cellPitch}
                                y={row * cellPitch}
                                width={cellSize}
                                height={cellSize}
                                fill={colors[i]}
                                rx="2"
                            />
                        );
                    })}
                </svg>
            </div>

            {hoveredData && (
                <div
                    className="fixed z-50 pointer-events-none bg-neutral-800 text-white text-xs px-3 py-1.5 rounded-md border border-white/10 shadow-xl whitespace-nowrap"
                    style={{
                        left: hoveredData.x,
                        top: hoveredData.y - 10,
                        transform: 'translate(-50%, -100%)'
                    }}
                >
                    <div className="font-semibold text-neon-green mb-0.5">
                        {hoveredData.value === 0 ? "No" : hoveredData.value} contributions
                    </div>
                    <div className="text-neutral-400 text-[10px]">
                        {hoveredData.date.toDateString()}
                    </div>
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-neutral-500 font-mono">
                <span>Total Contributions: {data.reduce((a, b) => a + b, 0)}</span>
                <span>Learn more on Github →</span>
            </div>
        </div>
    );
};

export default function GitHubAnalysis({ data }) {
    if (!data) return null;

    return (
        <section className="w-full py-20 bg-transparent relative overflow-hidden" id="github-analysis">
            <div className="max-w-7xl mx-auto px-4 z-10 relative">
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard title="Total Commits" value={data.totalCommits || 0} icon={GitCommit} delay={0.1} />
                    <StatCard title="Pull Requests" value={data.totalPRs || 0} icon={GitPullRequest} delay={0.2} />
                    <StatCard title="Issues Solved" value={data.totalIssues || 0} icon={GitMerge} delay={0.3} />
                    <StatCard title="Stars Earned" value={data.totalStars || 0} icon={Star} delay={0.4} />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <GithubHeatmapFast data={data.contributions} />

                    <div className="space-y-8">
                        <LanguageStats languages={data.languages} />
                        <ActivityFeed activities={data.recentActivity} />
                    </div>
                </div>
            </div>
        </section>
    );
}
