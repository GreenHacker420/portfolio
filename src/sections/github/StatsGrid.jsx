"use client";
import React from "react";
import { Flame, Trophy, GitPullRequest, Star, GitCommit, Zap } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { AnimatedNumber } from "./AnimatedNumber";
import { ProfileCard } from "./ProfileCard";

export const StatsGrid = ({ data }) => {
    const mostActiveDay = data.activityMetrics?.mostActiveDay;

    return (
        <>
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
        </>
    );
};
