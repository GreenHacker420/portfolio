/**
 * GitHub AI Analysis Component
 * Uses Gemini 2.0-flash to provide intelligent insights about GitHub activity
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  TrendingUp, 
  Code, 
  Star,
  ChevronDown,
  ChevronUp,
  Clock,
  Zap
} from 'lucide-react';
import { GitHubAIAnalysisProps, GitHubAIResponse } from '@/types/github';

/**
 * GitHub AI Analysis Component
 */
export function GitHubAIAnalysis({ 
  githubData, 
  isLoading: dataLoading, 
  className = '' 
}: GitHubAIAnalysisProps) {
  const [analysis, setAnalysis] = useState<GitHubAIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);

  /**
   * Generate AI analysis from GitHub data
   */
  const generateAnalysis = async (forceRefresh = false) => {
    if (!githubData || dataLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/github-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          githubData,
          forceRefresh,
        }),
      });

      const data: GitHubAIResponse = await response.json();

      if (data.success && data.analysis) {
        setAnalysis(data);
        setLastGenerated(new Date());
        setError(null);
      } else {
        setError(data.error || 'Failed to generate AI analysis');
      }
    } catch (err) {
      console.error('AI analysis error:', err);
      setError('Network error occurred while generating analysis');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate analysis when GitHub data is available
  useEffect(() => {
    if (githubData && !dataLoading && !analysis && !isLoading) {
      generateAnalysis();
    }
  }, [githubData, dataLoading, analysis, isLoading]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  if (!githubData && !dataLoading) {
    return null;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Brain className="text-purple-400" size={24} />
            <Sparkles className="absolute -top-1 -right-1 text-yellow-400" size={12} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              AI-Powered GitHub Insights
              <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                Gemini 2.0-flash
              </span>
            </h3>
            <p className="text-github-text text-sm">
              Intelligent analysis of your GitHub activity and coding patterns
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {lastGenerated && (
            <div className="text-xs text-github-text flex items-center gap-1">
              <Clock size={12} />
              {lastGenerated.toLocaleTimeString()}
            </div>
          )}
          
          <button
            onClick={() => generateAnalysis(true)}
            disabled={isLoading || dataLoading}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
            title="Regenerate AI analysis"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">
              {isLoading ? 'Analyzing...' : 'Refresh'}
            </span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {(isLoading || dataLoading) && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-purple-300">
            <div className="relative">
              <RefreshCw size={24} className="animate-spin" />
              <Zap className="absolute inset-0 text-yellow-400 animate-pulse" size={24} />
            </div>
            <div>
              <div className="font-medium">AI Analysis in Progress</div>
              <div className="text-sm text-github-text">
                Analyzing your GitHub activity patterns...
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !analysis && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="text-red-400" size={20} />
            <h4 className="font-semibold text-red-300">Analysis Failed</h4>
          </div>
          <p className="text-red-400 text-sm mb-3">{error}</p>
          <button
            onClick={() => generateAnalysis(true)}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      )}

      {/* Analysis Results */}
      {analysis?.analysis && !isLoading && (
        <div className="space-y-6">
          {/* Overview */}
          <motion.div
            variants={itemVariants}
            className="bg-github-dark/50 rounded-lg p-4"
          >
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="text-green-400" size={20} />
              Overview
            </h4>
            <p className="text-github-text leading-relaxed">
              {analysis.analysis.overview}
            </p>
          </motion.div>

          {/* Key Insights */}
          {analysis.analysis.insights && analysis.analysis.insights.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="bg-github-dark/50 rounded-lg p-4"
            >
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Sparkles className="text-yellow-400" size={20} />
                Key Insights
              </h4>
              <ul className="space-y-2">
                {analysis.analysis.insights.slice(0, isExpanded ? undefined : 3).map((insight, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    className="flex items-start gap-3 text-github-text"
                  >
                    <Star className="text-yellow-400 mt-1 flex-shrink-0" size={16} />
                    <span>{insight}</span>
                  </motion.li>
                ))}
              </ul>
              
              {analysis.analysis.insights.length > 3 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-2 mt-3 text-purple-400 hover:text-purple-300 transition-colors text-sm"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp size={16} />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} />
                      Show More ({analysis.analysis.insights.length - 3} more)
                    </>
                  )}
                </button>
              )}
            </motion.div>
          )}

          {/* Tech Stack & Strengths */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Strengths */}
            {analysis.analysis.strengths && analysis.analysis.strengths.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="bg-github-dark/50 rounded-lg p-4"
              >
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Code className="text-blue-400" size={20} />
                  Strengths
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.analysis.strengths.map((strength, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm border border-blue-500/30"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tech Stack */}
            {analysis.analysis.techStack && analysis.analysis.techStack.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="bg-github-dark/50 rounded-lg p-4"
              >
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Code className="text-green-400" size={20} />
                  Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.analysis.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-sm border border-green-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Cache Info */}
          {analysis.cached && (
            <div className="text-xs text-github-text flex items-center gap-2 pt-2 border-t border-github-border">
              <Clock size={12} />
              <span>
                Cached result ({analysis.cacheAge} minutes old)
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
