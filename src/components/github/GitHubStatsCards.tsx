 /**
 * GitHub Statistics Cards Component
 * Displays main GitHub statistics in card format
 */

'use client';

import React from 'react';
import { Star, GitFork, Users, Code, AlertCircle, RefreshCw } from 'lucide-react';
import { GitHubStatsCardsProps } from '@/types/github';
import StatCard from './StatCard';
import LoadingSkeleton from './LoadingSkeleton';
import GitHubStatsHeader from './GitHubStatsHeader';
import SecondaryStatsGrid from './SecondaryStatsGrid';

import { GitHubAIAnalysis } from './GitHubAIAnalysis';

/**
 * Main GitHub statistics cards component
 */
export function GitHubStatsCards({
  data,
  isLoading,
  error,
  onRefresh,
  isRefreshing
}: GitHubStatsCardsProps) {
  const handleRefresh = onRefresh;
  if (error && !data) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="text-red-500" size={24} />
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">
            Failed to Load GitHub Stats
          </h3>
        </div>
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={onRefresh}
          disabled={!!isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? 'Retrying...' : 'Retry'}
        </button>
      </div>
    );
  }

  const stats = data?.stats;
  const profile = data?.profile;

  return (
    <div className="space-y-6">
      {/* AI Analysis appears first time after stats load */}
      <GitHubAIAnalysis githubData={data || null} isLoading={!!isLoading} className="mb-4" />

      <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-github-card/60 to-github-card/20 p-6 overflow-hidden group">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(99,102,241,0.08),transparent_30%),radial-gradient(circle_at_90%_20%,rgba(16,185,129,0.08),transparent_25%)]" />
        {/* Animated green gradient border on hover */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute -inset-[1px] rounded-2xl bg-[conic-gradient(from_0deg,rgba(16,185,129,0.0),rgba(16,185,129,0.5),rgba(16,185,129,0.0))] animate-[spin_4s_linear_infinite]" />
        </div>
        <GitHubStatsHeader error={error || null} onRefresh={onRefresh} isRefreshing={isRefreshing} isLoading={isLoading} />

        {/* Green border overlay to create an animated glow along the edges */}
        <div className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 rounded-2xl [mask:linear-gradient(#000_0_0)]">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-green/0 via-neon-green/40 to-neon-green/0 blur-[2px]" />
          </div>
        </div>

        {/* Main statistics grid */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<Star className="text-yellow-400" size={18} />} label="Total Stars" value={stats?.totalStars || 0} sparkline={(data?.repositories||[]).slice(0,7).map(r=>r.stargazers_count||0).reverse()} sparklineColor="#f59e0b" />
            <StatCard icon={<GitFork className="text-blue-400" size={18} />} label="Total Forks" value={stats?.totalForks || 0} sparkline={(data?.repositories||[]).slice(0,7).map(r=>r.forks_count||0).reverse()} sparklineColor="#60a5fa" />
            <StatCard icon={<Users className="text-green-400" size={18} />} label="Followers" value={profile?.followers || 0} />
            <StatCard icon={<Code className="text-purple-400" size={18} />} label="Repositories" value={stats?.totalRepos || 0} />
          </div>
        )}

        {/* Secondary statistics */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <SecondaryStatsGrid stats={stats || null} profile={profile || null} />
        )}
      </div>
    </div>
  );
}
