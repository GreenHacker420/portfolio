/**
 * GitHub Statistics Cards Component
 * Displays main GitHub statistics in card format
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  GitFork, 
  Users, 
  Calendar, 
  Code, 
  GitCommit, 
  GitPullRequest, 
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';
import { GitHubStatsCardsProps } from '@/types/github';
import { formatNumber } from '@/utils/githubCalculations';

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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

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
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Real-time GitHub Statistics</h3>
          {error && (
            <p className="text-yellow-400 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </p>
          )}
        </div>
        <button
          onClick={onRefresh}
          disabled={isRefreshing || isLoading}
          className="flex items-center gap-2 px-3 py-2 bg-github-light/50 hover:bg-github-light text-white rounded-lg transition-colors disabled:opacity-50"
          title="Refresh GitHub data"
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">
            {isRefreshing ? 'Updating...' : 'Refresh'}
          </span>
        </button>
      </div>

      {/* Main statistics grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Total Stars */}
        <motion.div
          variants={itemVariants}
          className="p-4 bg-github-light/50 rounded-lg hover:bg-github-light transition-colors group"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Star className="text-yellow-400 group-hover:scale-110 transition-transform" size={20} />
            <p className="text-sm text-github-text">Total Stars</p>
          </div>
          <motion.p
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {isLoading ? '...' : formatNumber(stats?.totalStars || 0)}
          </motion.p>
        </motion.div>

        {/* Total Forks */}
        <motion.div
          variants={itemVariants}
          className="p-4 bg-github-light/50 rounded-lg hover:bg-github-light transition-colors group"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <GitFork className="text-blue-400 group-hover:scale-110 transition-transform" size={20} />
            <p className="text-sm text-github-text">Total Forks</p>
          </div>
          <motion.p
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {isLoading ? '...' : formatNumber(stats?.totalForks || 0)}
          </motion.p>
        </motion.div>

        {/* Followers */}
        <motion.div
          variants={itemVariants}
          className="p-4 bg-github-light/50 rounded-lg hover:bg-github-light transition-colors group"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-green-400 group-hover:scale-110 transition-transform" size={20} />
            <p className="text-sm text-github-text">Followers</p>
          </div>
          <motion.p
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {isLoading ? '...' : formatNumber(profile?.followers || 0)}
          </motion.p>
        </motion.div>

        {/* Public Repositories */}
        <motion.div
          variants={itemVariants}
          className="p-4 bg-github-light/50 rounded-lg hover:bg-github-light transition-colors group"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Code className="text-purple-400 group-hover:scale-110 transition-transform" size={20} />
            <p className="text-sm text-github-text">Repositories</p>
          </div>
          <motion.p
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {isLoading ? '...' : formatNumber(stats?.totalRepos || 0)}
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Secondary statistics */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Years of Coding */}
        <motion.div
          variants={itemVariants}
          className="p-4 bg-github-light/30 rounded-lg hover:bg-github-light/50 transition-colors group"
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-orange-400 group-hover:scale-110 transition-transform" size={18} />
            <p className="text-xs text-github-text">Years Coding</p>
          </div>
          <p className="text-lg font-bold text-white">
            {isLoading ? '...' : `${stats?.yearOfCoding || 0}+`}
          </p>
        </motion.div>

        {/* Current Streak */}
        <motion.div
          variants={itemVariants}
          className="p-4 bg-github-light/30 rounded-lg hover:bg-github-light/50 transition-colors group"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-green-400 group-hover:scale-110 transition-transform" size={18} />
            <p className="text-xs text-github-text">Current Streak</p>
          </div>
          <p className="text-lg font-bold text-white">
            {isLoading ? '...' : `${stats?.currentStreak || 0} days`}
          </p>
        </motion.div>

        {/* Contributed Repos */}
        <motion.div
          variants={itemVariants}
          className="p-4 bg-github-light/30 rounded-lg hover:bg-github-light/50 transition-colors group"
        >
          <div className="flex items-center gap-2 mb-2">
            <Award className="text-cyan-400 group-hover:scale-110 transition-transform" size={18} />
            <p className="text-xs text-github-text">Original Repos</p>
          </div>
          <p className="text-lg font-bold text-white">
            {isLoading ? '...' : formatNumber(stats?.contributedRepos || 0)}
          </p>
        </motion.div>

        {/* Account Age */}
        <motion.div
          variants={itemVariants}
          className="p-4 bg-github-light/30 rounded-lg hover:bg-github-light/50 transition-colors group"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-indigo-400 group-hover:scale-110 transition-transform" size={18} />
            <p className="text-xs text-github-text">Member Since</p>
          </div>
          <p className="text-lg font-bold text-white">
            {isLoading ? '...' : profile ? new Date(profile.created_at).getFullYear() : 'N/A'}
          </p>
        </motion.div>
      </motion.div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="relative">
          <div className="flex items-center gap-3 text-github-text justify-center py-8">
            <RefreshCw size={20} className="animate-spin" />
            <span>Loading GitHub statistics...</span>
          </div>
        </div>
      )}
    </div>
  );
}
