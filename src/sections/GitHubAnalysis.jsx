"use client";
import React, { useRef, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { GitCommit, GitPullRequest, GitMerge, Star, Activity, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/ui/stat-card";
import { LanguageStats, ActivityFeed } from "@/components/ui/activity-feed";

// Portal Component for Tooltip
const BodyPortal = ({ children }) => {
    if (typeof window === "undefined") return null;
    return createPortal(children, document.body);
};

const GithubHeatmapFast = ({ data, total }) => {
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

    // Precompute colors 
    const colors = useMemo(() => {
        return data.map((value) => {
            if (value >= 4) return "#39ff14";
            if (value >= 3) return "rgba(34,197,94,0.8)";
            if (value >= 2) return "rgba(21,128,61,0.6)";
            if (value >= 1) return "rgba(20,83,45,0.4)";
            return "#1a1a1a";
        });
    }, [data]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const col = Math.floor(x / cellPitch);
        const row = Math.floor(y / cellPitch);

        if (col >= 0 && col < weeks && row >= 0 && row < daysPerWeek) {
            const index = col * daysPerWeek + row;
            if (index < data.length) {
                setHoveredData({
                    value: data[index],
                    x: e.clientX,
                    y: e.clientY,
                    date: new Date(Date.now() - (data.length - index - 1) * 86400000)
                });
                return;
            }
        }
        setHoveredData(null);
    };

    return (
        <div className="col-span-2 bg-neutral-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm relative group overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-end mb-8 relative z-10">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-neon-green" />
                        Contribution Graph
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1">Consistency over the last 12 months</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-[#1a1a1a]" />
                        <div className="w-3 h-3 rounded-sm bg-green-900/40" />
                        <div className="w-3 h-3 rounded-sm bg-green-700/60" />
                        <div className="w-3 h-3 rounded-sm bg-green-500/80" />
                        <div className="w-3 h-3 rounded-sm bg-[#39ff14]" />
                    </div>
                    <span>More</span>
                </div>
            </div>

            {/* Canvas-like Grid */}
            <div
                className="relative cursor-crosshair overflow-x-auto pb-4 no-scrollbar"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoveredData(null)}
            >
                <div
                    style={{
                        width: width,
                        height: height,
                        display: 'grid',
                        gridTemplateColumns: `repeat(${weeks}, ${cellSize}px)`,
                        gap: cellGap,
                        gridAutoFlow: 'column'
                    }}
                >
                    {colors.map((color, i) => (
                        <div
                            key={i}
                            style={{ backgroundColor: color, width: cellSize, height: cellSize }}
                            className="rounded-[2px] transition-colors duration-200 hover:opacity-100"
                        />
                    ))}
                </div>
            </div>

            <div className="mt-6 flex justify-between items-center text-xs text-neutral-500 border-t border-white/5 pt-4">
                <span>Total Contributions:  {total}</span>
                <a href="https://github.com" target="_blank" className="hover:text-neon-green transition-colors flex items-center gap-1">
                    Learn more on Github →
                </a>
            </div>

            {/* Fixed Tooltip via Portal */}
            {hoveredData && (
                <BodyPortal>
                    <div
                        className="fixed z-[9999] pointer-events-none bg-zinc-900 text-white text-xs py-2 px-3 rounded-lg shadow-xl border border-white/10 whitespace-nowrap"
                        style={{
                            left: hoveredData.x,
                            top: hoveredData.y,
                            transform: 'translate(-50%, -140%)'
                        }}
                    >
                        <strong className="block text-neon-green mb-0.5">
                            {hoveredData.value} contributions
                        </strong>
                        <span className="text-zinc-400">
                            {hoveredData.date.toDateString()}
                        </span>
                        {/* Triangle */}
                        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-zinc-900" />
                    </div>
                </BodyPortal>
            )}
        </div>
    );
};


export default function GitHubAnalysis({ initialData }) {
    const data = initialData || {};
    const [isRefreshing, setIsRefreshing] = useState(false);
    const router = useRouter();

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await fetch("/api/github/refresh?username=" + (data.username || "GreenHacker420"), {
                method: "POST"
            });
            router.refresh(); // Reload server components
        } catch (error) {
            console.error("Failed to refresh stats:", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <section className="py-20 bg-black relative z-10" id="github">
            <div className="container mx-auto px-4">
                <div className="mb-16">
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

                    <motion.button
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="mt-6 flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-white/10 rounded-lg text-sm text-neutral-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-50"
                    >
                        <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Syncing...' : 'Sync with GitHub'}
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        title="Total Contributions"
                        value={data.activityMetrics?.totalContributions || "0"}
                        icon={GitCommit}
                        delay={0.1}
                        description="Last 365 days"
                    />
                    <StatCard
                        title="Pull Requests"
                        value={data.activityMetrics?.recentPRs ?? 0}
                        icon={GitPullRequest}
                        delay={0.2}
                        description="Public events"
                    />
                    <StatCard
                        title="Issues Active"
                        value={data.activityMetrics?.recentIssues ?? 0}
                        icon={GitMerge}
                        delay={0.3}
                        description="Public events"
                    />
                    <StatCard
                        title="Total Stars"
                        value={data.totalStars || 0}
                        icon={Star}
                        delay={0.4}
                    />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Heatmap */}
                    {data.contributions && data.contributions.length > 0 ? (
                        <GithubHeatmapFast
                            data={data.contributions}
                            total={data.activityMetrics?.totalContributions || 0}
                        />
                    ) : (
                        <div className="col-span-2 bg-neutral-900/50 rounded-xl border border-neutral-800 p-8 flex items-center justify-center text-neutral-500">
                            <p>Contribution graph loading or unavailable.</p>
                        </div>
                    )}

                    <div className="space-y-8">
                        <LanguageStats languages={data.languages} />
                        <ActivityFeed activities={data.recentActivity} />
                    </div>
                </div>
            </div>
        </section>
    );
}
