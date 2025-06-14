
'use client';

import { motion } from 'framer-motion';
import { ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import {
  TrendingUp,
  Zap,
  Calendar,
  Target,
  BarChart3,
  Award
} from 'lucide-react';

// Import our new modular components
import { GitHubStatsCards } from '@/components/github/GitHubStatsCards';
import { GitHubContributionHeatmap } from '@/components/github/GitHubContributionHeatmap';
import { GitHubAIAnalysis } from '@/components/github/GitHubAIAnalysis';

// Import custom hooks
import { useGitHubStatsWithOptions } from '@/hooks/useGitHubStats';
import { useGitHubContributionsWithStats } from '@/hooks/useGitHubContributions';



/**
 * Enhanced GitHub Stats Section Component
 * Refactored to use modular components and custom hooks
 */
const Stats = () => {
  // Use our custom hooks for data management
  const {
    data: githubData,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
    isRefreshing,
  } = useGitHubStatsWithOptions({
    autoRefresh: false,
    retryAttempts: 3,
  });

  const {
    contributions,
    isLoading: contributionsLoading,
    error: contributionsError,
    refetch: refetchContributions,
    stats: contributionStats,
  } = useGitHubContributionsWithStats();

  // Handle refresh for all data
  const handleRefresh = async () => {
    await Promise.all([
      refetchStats(),
      refetchContributions(),
    ]);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  return (
    <section id="stats" className="py-20 bg-github-light">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title mb-4">GitHub Statistics & Insights</h2>
          <p className="text-github-text max-w-2xl mx-auto">
            Real-time GitHub analytics powered by AI insights and comprehensive contribution tracking
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-8"
        >
          {/* GitHub Statistics Cards - Always visible at top */}
          <motion.div variants={itemVariants}>
            <GitHubStatsCards
              data={githubData}
              isLoading={statsLoading}
              error={statsError}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />
          </motion.div>

          {/* Contribution Heatmap - Below main stats */}
          <motion.div variants={itemVariants}>
            <GitHubContributionHeatmap
              contributions={contributions}
              isLoading={contributionsLoading}
              error={contributionsError}
              className="w-full"
            />
          </motion.div>

          {/* Contribution Statistics - Below heatmap */}
          {(contributionStats || contributionsLoading) && (
            <motion.div variants={itemVariants}>
              <div className="bg-github-dark p-6 rounded-xl border border-github-border">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <BarChart3 className="text-neon-green" size={24} />
                  Contribution Statistics
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {/* Total Contributions */}
                  <motion.div
                    className="bg-github-light/30 p-4 rounded-lg text-center hover:bg-github-light/50 transition-colors group"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <Target className="text-white group-hover:scale-110 transition-transform" size={20} />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {contributionsLoading ? '...' : contributionStats?.totalContributions.toLocaleString() || '0'}
                    </div>
                    <div className="text-sm text-github-text">Total Contributions</div>
                  </motion.div>

                  {/* Current Streak */}
                  <motion.div
                    className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg text-center hover:bg-green-900/30 transition-colors group"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <Zap className="text-green-400 group-hover:scale-110 transition-transform" size={20} />
                    </div>
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {contributionsLoading ? '...' : contributionStats?.currentStreak || 0}
                    </div>
                    <div className="text-sm text-green-300">Current Streak</div>
                    <div className="text-xs text-green-500 mt-1">days</div>
                  </motion.div>

                  {/* Longest Streak */}
                  <motion.div
                    className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg text-center hover:bg-blue-900/30 transition-colors group"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="text-blue-400 group-hover:scale-110 transition-transform" size={20} />
                    </div>
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {contributionsLoading ? '...' : contributionStats?.longestStreak || 0}
                    </div>
                    <div className="text-sm text-blue-300">Longest Streak</div>
                    <div className="text-xs text-blue-500 mt-1">days</div>
                  </motion.div>

                  {/* Active Days */}
                  <motion.div
                    className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg text-center hover:bg-purple-900/30 transition-colors group"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <Calendar className="text-purple-400 group-hover:scale-110 transition-transform" size={20} />
                    </div>
                    <div className="text-2xl font-bold text-purple-400 mb-1">
                      {contributionsLoading ? '...' : contributionStats?.activeDays || 0}
                    </div>
                    <div className="text-sm text-purple-300">Active Days</div>
                  </motion.div>

                  {/* Average Per Day */}
                  <motion.div
                    className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-lg text-center hover:bg-yellow-900/30 transition-colors group"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <BarChart3 className="text-yellow-400 group-hover:scale-110 transition-transform" size={20} />
                    </div>
                    <div className="text-2xl font-bold text-yellow-400 mb-1">
                      {contributionsLoading ? '...' : contributionStats?.averagePerDay || 0}
                    </div>
                    <div className="text-sm text-yellow-300">Avg Per Day</div>
                  </motion.div>

                  {/* Best Day */}
                  <motion.div
                    className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg text-center hover:bg-red-900/30 transition-colors group"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <Award className="text-red-400 group-hover:scale-110 transition-transform" size={20} />
                    </div>
                    <div className="text-2xl font-bold text-red-400 mb-1">
                      {contributionsLoading ? '...' : contributionStats?.bestDay?.count || 0}
                    </div>
                    <div className="text-sm text-red-300">Best Day</div>
                    {contributionStats?.bestDay && !contributionsLoading && (
                      <div className="text-xs text-red-500 mt-1">
                        {new Date(contributionStats.bestDay.date).toLocaleDateString()}
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* AI-Powered Analysis - Below heatmap */}
          <motion.div variants={itemVariants}>
            <GitHubAIAnalysis
              githubData={githubData}
              isLoading={statsLoading}
              className="w-full"
            />
          </motion.div>

          {/* Optional: Language Distribution Chart */}
          {githubData?.languages && githubData.languages.length > 0 && (
            <motion.div variants={itemVariants} className="bg-github-dark p-6 rounded-xl border border-github-border">
              <h3 className="text-xl font-bold text-white mb-6">Language Distribution</h3>
              <div className="flex">
                <div className="h-64 w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={githubData.languages}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="percentage"
                        label={({ name, percentage }) => `${name} ${percentage}%`}
                        labelLine={false}
                      >
                        {githubData.languages.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
                        formatter={(value) => [`${value}%`, 'Usage']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 flex flex-col justify-center space-y-4 pl-4">
                  {githubData.languages.map((lang, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: lang.color }}></div>
                      <span className="text-white mr-2">{lang.name}</span>
                      <span className="text-sm text-github-text">{lang.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
