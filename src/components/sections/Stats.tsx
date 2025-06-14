
'use client';

import { motion } from 'framer-motion';
import { ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';

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
