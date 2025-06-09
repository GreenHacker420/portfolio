'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Sparkles, RefreshCw, AlertCircle, Clock } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface GitHubStatsAIProps {
  githubData?: any
}

interface AIOverviewResponse {
  success: boolean
  overview?: string
  cached?: boolean
  cacheAge?: number
  error?: string
}

export default function GitHubStatsAI({ githubData }: GitHubStatsAIProps) {
  const [aiOverview, setAiOverview] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [isCached, setIsCached] = useState(false)
  const [cacheAge, setCacheAge] = useState<number>(0)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const generateOverview = async (forceRefresh = false) => {
    if (!githubData) {
      setError('GitHub data not available')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/ai/github-overview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          githubData,
          forceRefresh 
        }),
      })

      const data: AIOverviewResponse = await response.json()

      if (data.success && data.overview) {
        setAiOverview(data.overview)
        setIsCached(data.cached || false)
        setCacheAge(data.cacheAge || 0)
        setLastUpdated(new Date())
        setError('')
      } else {
        setError(data.error || 'Failed to generate AI overview')
      }
    } catch (err) {
      setError('Network error occurred while generating overview')
      console.error('AI overview error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-generate on mount if GitHub data is available
  useEffect(() => {
    if (githubData && !aiOverview && !isLoading) {
      generateOverview()
    }
  }, [githubData])

  if (!githubData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800"
      >
        <div className="flex items-center gap-3 mb-4">
          <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            AI-Powered GitHub Analysis
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          GitHub data is loading... AI analysis will be available shortly.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <Sparkles className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              AI-Powered GitHub Analysis
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Intelligent insights powered by Google Gemini
            </p>
          </div>
        </div>

        <button
          onClick={() => generateOverview(true)}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors duration-200"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Analyzing...' : 'Refresh'}
        </button>
      </div>

      {/* Cache Status */}
      {(isCached || lastUpdated) && !isLoading && (
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="h-4 w-4" />
          {isCached ? (
            <span>Cached analysis ({cacheAge} minutes old)</span>
          ) : (
            <span>
              Last updated: {lastUpdated?.toLocaleTimeString()}
            </span>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              AI is analyzing your GitHub profile...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              This may take a few moments
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <div>
            <p className="text-red-800 dark:text-red-200 font-medium">
              Failed to generate AI analysis
            </p>
            <p className="text-red-600 dark:text-red-300 text-sm mt-1">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* AI Overview Content */}
      {aiOverview && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-gray dark:prose-invert max-w-none"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 mt-6">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 mt-4">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-3 space-y-1">
                    {children}
                  </ul>
                ),
                li: ({ children }) => (
                  <li className="text-gray-600 dark:text-gray-300">
                    {children}
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-800 dark:text-gray-200">
                    {children}
                  </strong>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono text-purple-600 dark:text-purple-400">
                    {children}
                  </code>
                ),
              }}
            >
              {aiOverview}
            </ReactMarkdown>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!aiOverview && !isLoading && !error && (
        <div className="text-center py-8">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            No AI analysis available yet
          </p>
          <button
            onClick={() => generateOverview()}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
          >
            Generate AI Analysis
          </button>
        </div>
      )}

      {/* Powered by notice */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Powered by Google Gemini AI • Analysis updates every 24 hours
        </p>
      </div>
    </motion.div>
  )
}
