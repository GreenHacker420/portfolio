"use client";
import React, { useRef, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { GitCommit, GitPullRequest, GitMerge, Star, Activity, RefreshCcw, Flame, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/ui/stat-card";
import { LanguageStats, ActivityFeed } from "@/components/ui/activity-feed";

// Portal Component for Tooltip
const BodyPortal = ({ children }) => {
    if (typeof window === "undefined") return null;
    return createPortal(children, document.body);
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

const getColor = (count) => {
    if (count >= 8) return "#39ff14";
    if (count >= 4) return "#22c55e";
    if (count >= 2) return "#15803d";
    if (count >= 1) return "#14532d";
    return "#161b22";
};

const formatTooltipDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};

const GithubHeatmapFast = ({ data, total }) => {
    if (!data || data.length === 0) return null;

    const [tooltip, setTooltip] = useState(null);
    const cellSize = 12;
    const cellGap = 3;

    // Organize data into weeks (columns of 7 days)
    const weeks = useMemo(() => {
        const w = [];
        for (let i = 0; i < data.length; i += 7) {
            w.push(data.slice(i, i + 7));
        }
        return w;
    }, [data]);

    // Compute month label positions from actual dates
    const monthLabels = useMemo(() => {
        const labels = [];
        let lastMonth = -1;
        weeks.forEach((week, weekIdx) => {
            const firstDay = week[0];
            if (!firstDay?.date) return;
            const month = new Date(firstDay.date + 'T00:00:00').getMonth();
            if (month !== lastMonth) {
                labels.push({ month: MONTH_LABELS[month], weekIdx });
                lastMonth = month;
            }
        });
        return labels;
    }, [weeks]);

    const handleCellEnter = (day, e) => {
        if (!day?.date) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
            count: day.count,
            date: day.date,
            x: rect.left + rect.width / 2,
            y: rect.top
        });
    };

    return (
        <div className="w-full bg-neutral-900/40 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-sm relative group overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-end mb-6 relative z-10">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-neon-green" />
                        Contribution Graph
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1">Last 365 days of coding activity</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span>Less</span>
                    <div className="flex gap-[3px]">
                        {['#161b22', '#14532d', '#15803d', '#22c55e', '#39ff14'].map(c => (
                            <div key={c} className="w-[12px] h-[12px] rounded-[3px]" style={{ backgroundColor: c }} />
                        ))}
                    </div>
                    <span>More</span>
                </div>
            </div>

            {/* Heatmap Grid */}
            <div className="overflow-x-auto no-scrollbar pb-2">
                {/* Month Labels Row */}
                <div className="flex" style={{ paddingLeft: 32 }}>
                    {(() => {
                        const totalWeeks = weeks.length;
                        const pitch = cellSize + cellGap;
                        return monthLabels.map((label, i) => {
                            const nextIdx = i + 1 < monthLabels.length ? monthLabels[i + 1].weekIdx : totalWeeks;
                            const span = nextIdx - label.weekIdx;
                            return (
                                <div
                                    key={`${label.month}-${label.weekIdx}`}
                                    className="text-[11px] text-neutral-500 font-medium"
                                    style={{ width: span * pitch, flexShrink: 0 }}
                                >
                                    {span >= 2 ? label.month : ''}
                                </div>
                            );
                        });
                    })()}
                </div>

                {/* Grid with Day Labels */}
                <div className="flex gap-0 mt-1">
                    {/* Day-of-week labels */}
                    <div className="flex flex-col flex-shrink-0" style={{ width: 32, gap: cellGap }}>
                        {DAY_LABELS.map((label, i) => (
                            <div
                                key={i}
                                className="text-[10px] text-neutral-600 flex items-center"
                                style={{ height: cellSize }}
                            >
                                {label}
                            </div>
                        ))}
                    </div>

                    {/* Contribution cells */}
                    <div className="flex" style={{ gap: cellGap }}>
                        {weeks.map((week, wi) => (
                            <div key={wi} className="flex flex-col" style={{ gap: cellGap }}>
                                {week.map((day, di) => (
                                    <div
                                        key={day?.date || `${wi}-${di}`}
                                        className="rounded-[3px] transition-all duration-150 hover:ring-1 hover:ring-white/30 hover:scale-110 cursor-pointer"
                                        style={{
                                            width: cellSize,
                                            height: cellSize,
                                            backgroundColor: getColor(day?.count || 0)
                                        }}
                                        onMouseEnter={(e) => handleCellEnter(day, e)}
                                        onMouseLeave={() => setTooltip(null)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex justify-between items-center text-xs text-neutral-500 border-t border-white/5 pt-4">
                <span>{total.toLocaleString()} contributions in the last year</span>
                <a href={`https://github.com/${data[0]?.date ? 'GreenHacker420' : ''}`} target="_blank" rel="noopener noreferrer" className="hover:text-neon-green transition-colors flex items-center gap-1">
                    Learn more on GitHub →
                </a>
            </div>

            {/* Tooltip */}
            {tooltip && (
                <BodyPortal>
                    <div
                        className="fixed z-[9999] pointer-events-none bg-zinc-800/95 text-white text-xs py-2.5 px-3.5 rounded-xl shadow-2xl border border-white/10 whitespace-nowrap backdrop-blur-sm"
                        style={{
                            left: tooltip.x,
                            top: tooltip.y,
                            transform: 'translate(-50%, -120%)'
                        }}
                    >
                        <strong className="block text-neon-green text-[13px] mb-0.5">
                            {tooltip.count} contribution{tooltip.count !== 1 ? 's' : ''}
                        </strong>
                        <span className="text-zinc-400 text-[11px]">
                            {formatTooltipDate(tooltip.date)}
                        </span>
                        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-zinc-800/95" />
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
        <section className="py-20 bg-transparent relative z-10" id="github">
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

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                    {/* Heatmap Section - Huge */}
                    <div className="md:col-span-3 lg:col-span-3">
                        {data.contributions && data.contributions.length > 0 ? (
                            <GithubHeatmapFast
                                data={data.contributions}
                                total={data.activityMetrics?.totalContributions || 0}
                            />
                        ) : (
                            <div className="w-full h-full min-h-[300px] bg-neutral-900/50 rounded-3xl border border-white/5 p-8 flex items-center justify-center text-neutral-500 backdrop-blur-sm">
                                <p>Contribution graph loading or unavailable.</p>
                            </div>
                        )}
                    </div>

                    {/* Languages Section - Side of Heatmap */}
                    <div className="md:col-span-3 lg:col-span-1 flex">
                        <LanguageStats languages={data.languages} className="flex-1" />
                    </div>

                    {/* Middle Row: Streak and PR Cards (1 col each) */}
                    <StatCard
                        title="Current Streak"
                        value={data.activityMetrics?.currentStreak ?? 0}
                        icon={Flame}
                        delay={0.1}
                        description="Days active"
                    />
                    <StatCard
                        title="Longest Streak"
                        value={data.activityMetrics?.longestStreak ?? 0}
                        icon={Trophy}
                        delay={0.2}
                        description="All time record"
                    />
                    <StatCard
                        title="Pull Requests"
                        value={data.activityMetrics?.recentPRs ?? 0}
                        icon={GitPullRequest}
                        delay={0.3}
                        description="Lifetime total"
                    />
                    <StatCard
                        title="Issues Managed"
                        value={data.activityMetrics?.recentIssues ?? 0}
                        icon={GitMerge}
                        delay={0.4}
                        description="Lifetime total"
                    />

                    {/* Bottom Row */}
                    <div className="md:col-span-3 lg:col-span-2 flex">
                        <ActivityFeed activities={data.recentActivity} className="flex-1" />
                    </div>

                    <StatCard
                        title="Total Stars"
                        value={data.totalStars || 0}
                        icon={Star}
                        delay={0.5}
                        className="md:col-span-1 lg:col-span-1"
                    />
                    <StatCard
                        title="Total Contributions"
                        value={data.activityMetrics?.totalContributions || "0"}
                        icon={GitCommit}
                        delay={0.6}
                        description="Last 365 days"
                        className="md:col-span-2 lg:col-span-1"
                    />
                </div>
            </div>
        </section>
    );
}
