"use client";
import React, { useRef, useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useInView } from "framer-motion";
import {
    GitCommit, GitPullRequest, Star, Activity, RefreshCcw,
    Flame, Trophy, MapPin, Calendar, Users, GitFork, ExternalLink, Code2, Zap,
    Clock, ArrowUpRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/ui/stat-card";
import { LanguageStats, ActivityFeed } from "@/components/ui/activity-feed";

// ============================================================
// ANIMATED COUNTER
// ============================================================
const AnimatedNumber = ({ value, duration = 1.5 }) => {
    const [display, setDisplay] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (!isInView || !value) return;
        const target = typeof value === 'number' ? value : parseInt(value) || 0;
        if (target === 0) return;

        const startTime = Date.now();
        const dur = duration * 1000;
        const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / dur, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [isInView, value, duration]);

    return <span ref={ref}>{display.toLocaleString()}</span>;
};

// ============================================================
// PORTAL TOOLTIP
// ============================================================
const BodyPortal = ({ children }) => {
    if (typeof window === "undefined") return null;
    return createPortal(children, document.body);
};

// ============================================================
// CONTRIBUTION HEATMAP
// ============================================================
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
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const cellSize = isMobile ? 10 : 13;
    const cellGap = isMobile ? 2 : 3;

    const weeks = useMemo(() => {
        const w = [];
        for (let i = 0; i < data.length; i += 7) {
            w.push(data.slice(i, i + 7));
        }
        return w;
    }, [data]);

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
        <div className="w-full bg-neutral-900/40 border border-white/5 rounded-3xl p-5 md:p-8 backdrop-blur-sm relative group overflow-hidden">
            <div className="flex justify-between items-end mb-6 relative z-10">
                <div>
                    <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-neon-green" />
                        Contribution Graph
                    </h3>
                    <p className="text-xs md:text-sm text-neutral-500 mt-1">Last 365 days of coding activity</p>
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

            <div className="overflow-x-auto no-scrollbar pb-2">
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

                <div className="flex gap-0 mt-1">
                    <div className="flex flex-col flex-shrink-0" style={{ width: 32, gap: cellGap }}>
                        {DAY_LABELS.map((label, i) => (
                            <div key={i} className="text-[10px] text-neutral-600 flex items-center" style={{ height: cellSize }}>
                                {label}
                            </div>
                        ))}
                    </div>
                    <div className="flex" style={{ gap: cellGap }}>
                        {weeks.map((week, wi) => (
                            <div key={wi} className="flex flex-col" style={{ gap: cellGap }}>
                                {week.map((day, di) => (
                                    <div
                                        key={day?.date || `${wi}-${di}`}
                                        className="rounded-[3px] transition-all duration-150 hover:ring-1 hover:ring-white/30 hover:scale-110 cursor-pointer"
                                        style={{ width: cellSize, height: cellSize, backgroundColor: getColor(day?.count || 0) }}
                                        onMouseEnter={(e) => handleCellEnter(day, e)}
                                        onMouseLeave={() => setTooltip(null)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-4 flex justify-between items-center text-xs text-neutral-500 border-t border-white/5 pt-4">
                <span>{(total || 0).toLocaleString()} contributions in the last year</span>
                <a href="https://github.com/GreenHacker420" target="_blank" rel="noopener noreferrer" className="hover:text-neon-green transition-colors flex items-center gap-1">
                    Learn more on GitHub <ArrowUpRight className="w-3 h-3" />
                </a>
            </div>

            {tooltip && (
                <BodyPortal>
                    <div
                        className="fixed z-[9999] pointer-events-none bg-zinc-800/95 text-white text-xs py-2.5 px-3.5 rounded-xl shadow-2xl border border-white/10 whitespace-nowrap backdrop-blur-sm"
                        style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -120%)' }}
                    >
                        <strong className="block text-neon-green text-[13px] mb-0.5">
                            {tooltip.count} contribution{tooltip.count !== 1 ? 's' : ''}
                        </strong>
                        <span className="text-zinc-400 text-[11px]">{formatTooltipDate(tooltip.date)}</span>
                        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-zinc-800/95" />
                    </div>
                </BodyPortal>
            )}
        </div>
    );
};

// ============================================================
// PROFILE HEADER CARD
// ============================================================
const ProfileCard = ({ profile, publicRepos, followers, following, totalStars }) => {
    if (!profile) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-neutral-900/80 to-neutral-950/90 border border-white/5 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group hover:border-neon-green/20 transition-all duration-500 h-full"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-green/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="flex items-center gap-4 mb-5 relative z-10">
                <div className="relative flex-shrink-0">
                    <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-16 h-16 rounded-2xl border-2 border-neon-green/20 group-hover:border-neon-green/50 transition-colors"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-neon-green rounded-full border-2 border-neutral-900 flex items-center justify-center">
                        <div className="w-2 h-2 bg-neutral-900 rounded-full" />
                    </div>
                </div>
                <div className="min-w-0">
                    <h3 className="text-xl font-bold text-white truncate">{profile.name}</h3>
                    {profile.location && (
                        <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 flex-shrink-0" /> {profile.location}
                        </p>
                    )}
                    {profile.memberSince && (
                        <p className="text-xs text-neutral-600 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3 flex-shrink-0" /> Member since {profile.memberSince}
                        </p>
                    )}
                </div>
            </div>

            {profile.bio && (
                <p className="text-sm text-neutral-400 mb-5 leading-relaxed relative z-10 line-clamp-2">{profile.bio}</p>
            )}

            <div className="grid grid-cols-4 gap-2 relative z-10">
                {[
                    { label: 'Repos', value: publicRepos, icon: Code2 },
                    { label: 'Stars', value: totalStars, icon: Star },
                    { label: 'Followers', value: followers, icon: Users },
                    { label: 'Contrib To', value: profile.contributedTo, icon: GitFork },
                ].map(item => (
                    <div key={item.label} className="text-center py-2.5 px-1 rounded-xl bg-white/[3%] hover:bg-white/[6%] transition-colors">
                        <item.icon className="w-3.5 h-3.5 mx-auto mb-1 text-neutral-500" />
                        <p className="text-lg font-bold text-white leading-none">
                            <AnimatedNumber value={item.value || 0} duration={1.2} />
                        </p>
                        <p className="text-[9px] text-neutral-600 mt-0.5 uppercase tracking-wider">{item.label}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

// ============================================================
// TOP REPOS SHOWCASE
// ============================================================
const TopRepos = ({ repos }) => {
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

// ============================================================
// LATEST WORKS — Recent push activity
// ============================================================
const LatestWorks = ({ activities }) => {
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

// ============================================================
// MAIN SECTION
// ============================================================
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
            router.refresh();
        } catch (error) {
            console.error("Failed to refresh stats:", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const mostActiveDay = data.activityMetrics?.mostActiveDay;

    return (
        <section className="py-20 bg-transparent relative z-10" id="github">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Section Header */}
                <div className="mb-12 md:mb-16">
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
                        className="text-4xl md:text-6xl font-bold text-white mb-4"
                    >
                        Code Analysis
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-neutral-400 max-w-xl text-base md:text-lg leading-relaxed"
                    >
                        A live window into my open source contributions, coding consistency, and technical milestones.
                    </motion.p>

                    <motion.button
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-white/10 rounded-lg text-sm text-neutral-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-50"
                    >
                        <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Syncing...' : 'Sync with GitHub'}
                    </motion.button>
                </div>

                {/* ===== ROW 1: Heatmap (full width) ===== */}
                <div className="mb-6">
                    {data.contributions && data.contributions.length > 0 ? (
                        <GithubHeatmapFast
                            data={data.contributions}
                            total={data.activityMetrics?.totalContributions || 0}
                        />
                    ) : (
                        <div className="w-full min-h-[200px] md:min-h-[280px] bg-neutral-900/50 rounded-3xl border border-white/5 p-8 flex items-center justify-center text-neutral-500 backdrop-blur-sm">
                            <p>Contribution graph loading or unavailable.</p>
                        </div>
                    )}
                </div>

                {/* ===== ROW 2: Profile + Stats (3x2 grid) ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
                    <ProfileCard
                        profile={data.profile}
                        publicRepos={data.publicRepos}
                        followers={data.followers}
                        following={data.following}
                        totalStars={data.totalStars}
                    />
                    <StatCard
                        title="Current Streak"
                        value={<AnimatedNumber value={data.activityMetrics?.currentStreak ?? 0} />}
                        icon={Flame}
                        delay={0.1}
                        description="Days active"
                    />
                    <StatCard
                        title="Longest Streak"
                        value={<AnimatedNumber value={data.activityMetrics?.longestStreak ?? 0} />}
                        icon={Trophy}
                        delay={0.15}
                        description="All time record"
                    />
                </div>

                {/* ===== ROW 3: More Stats ===== */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
                    <StatCard
                        title="Pull Requests"
                        value={<AnimatedNumber value={data.activityMetrics?.recentPRs ?? 0} />}
                        icon={GitPullRequest}
                        delay={0.2}
                        description="Lifetime total"
                    />
                    <StatCard
                        title="Total Stars"
                        value={<AnimatedNumber value={data.totalStars || 0} />}
                        icon={Star}
                        delay={0.25}
                    />
                    <StatCard
                        title="Total Contributions"
                        value={<AnimatedNumber value={data.activityMetrics?.totalContributions || 0} />}
                        icon={GitCommit}
                        delay={0.3}
                        description="Last 365 days"
                    />
                    {mostActiveDay && (
                        <StatCard
                            title="Most Active Day"
                            value={mostActiveDay.day}
                            icon={Zap}
                            delay={0.35}
                            description={`${mostActiveDay.count.toLocaleString()} contributions`}
                        />
                    )}
                </div>

                {/* ===== ROW 4: Top Repos + Latest Works + Languages ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <TopRepos repos={data.showcaseRepos} />
                    <LatestWorks activities={data.recentActivity} />
                    <LanguageStats languages={data.languages} className="h-full" />
                </div>
            </div>
        </section>
    );
}
