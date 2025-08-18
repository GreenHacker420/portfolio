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
          disabled={isRefreshing}
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
      <GitHubStatsHeader error={error || null} onRefresh={onRefresh} isRefreshing={isRefreshing} isLoading={isLoading} />

      {/* Main statistics grid */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Star className="text-yellow-400" size={20} />} label="Total Stars" value={stats?.totalStars || 0} />
          <StatCard icon={<GitFork className="text-blue-400" size={20} />} label="Total Forks" value={stats?.totalForks || 0} />
          <StatCard icon={<Users className="text-green-400" size={20} />} label="Followers" value={profile?.followers || 0} />
          <StatCard icon={<Code className="text-purple-400" size={20} />} label="Repositories" value={stats?.totalRepos || 0} />
        </div>
      )}

      {/* Secondary statistics */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <SecondaryStatsGrid stats={stats || null} profile={profile || null} />
      )}
    </div>
  );
}
