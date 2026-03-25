"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { LanguageStats } from "@/components/ui/activity-feed";
import { useGithubData } from "@/hooks/useGithubData";

// Internal sub-components
import { GithubHeatmap } from "./github/GithubHeatmap";
import { StatsGrid } from "./github/StatsGrid";
import { TopRepos } from "./github/TopRepos";
import { LatestWorks } from "./github/LatestWorks";

export default function GitHubAnalysis({ initialData }) {
    const { stats: storeData, loading: storeLoading } = useGithubData();
    const data = storeData || initialData || {};
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

    return (
        <section className="py-20 bg-transparent relative z-10" id="github">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="mb-12 md:mb-16">
                    <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        className="text-neon-green font-mono text-sm tracking-widest mb-2 block">04. INTELLIGENCE</motion.span>
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold text-white mb-4">Code Analysis</motion.h2>
                    <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-neutral-400 max-w-xl text-base md:text-lg leading-relaxed">
                        A live window into my open source contributions, coding consistency, and technical milestones.
                    </motion.p>
                    <motion.button initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }}
                        onClick={handleRefresh} disabled={isRefreshing || storeLoading}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-white/10 rounded-lg text-sm text-neutral-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-50">
                        <RefreshCcw className={`w-4 h-4 ${isRefreshing || storeLoading ? 'animate-spin' : ''}`} />
                        {isRefreshing || storeLoading ? 'Syncing...' : 'Sync with GitHub'}
                    </motion.button>
                </div>

                <div className="mb-6">
                    {data.contributions?.length > 0 ? (
                        <GithubHeatmap data={data.contributions} total={data.activityMetrics?.totalContributions || 0} />
                    ) : (
                        <div className="w-full min-h-[200px] md:min-h-[280px] bg-neutral-900/50 rounded-3xl border border-white/5 p-8 flex items-center justify-center text-neutral-500 backdrop-blur-sm">
                            <p className={storeLoading ? "animate-pulse" : ""}>{storeLoading ? "Fetching intelligence..." : "Graph unavailable."}</p>
                        </div>
                    )}
                </div>

                <StatsGrid data={data} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <TopRepos repos={data.showcaseRepos} />
                    <LatestWorks activities={data.recentActivity} />
                    <LanguageStats languages={data.languages} className="h-full" />
                </div>
            </div>
        </section>
    );
}
