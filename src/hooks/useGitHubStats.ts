/**
 * Custom hook for fetching and managing GitHub statistics data
 * Provides comprehensive GitHub data with caching and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import { GitHubData, GitHubAPIResponse, UseGitHubStatsReturn, GITHUB_API_ENDPOINTS } from '@/types/github';

/**
 * Hook for managing GitHub statistics data
 */
export function useGitHubStats(): UseGitHubStatsReturn {
  const [data, setData] = useState<GitHubData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  /**
   * Fetch GitHub statistics from API
   */
  const fetchGitHubStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch unified aggregate payload with cache-busting to avoid stale edge cache
      const aggUrl = `${GITHUB_API_ENDPOINTS.AGGREGATE}?t=${Date.now()}`;
      const aggRes = await fetch(aggUrl);
      if (!aggRes.ok) {
        const errorText = await aggRes.text();
        console.error('Aggregate API error:', aggRes.status, errorText);
        throw new Error(`Failed to fetch aggregate: ${aggRes.status}`);
      }
      const agg: GitHubAPIResponse<GitHubData> = await aggRes.json();
      if (!agg.success || !agg.data) {
        throw new Error(`Aggregate API returned error: ${agg.error || 'Unknown'}`);
      }
      const { data: aggregate } = agg;

      // Fallback client-side enhancement: compute totals and streaks from contributions
      try {
        const days = (aggregate.contributions?.weeks || []).flatMap(w => (w as any).contributionDays || []);
        if (days.length) {
          const { calculateContributionStreaks, calculateTotalContributions } = await import('@/utils/githubCalculations');
          const totals = calculateTotalContributions(days);
          const { currentStreak, longestStreak } = calculateContributionStreaks(days);
          aggregate.stats = {
            ...aggregate.stats,
            totalContributions: totals,
            currentStreak,
            longestStreak,
          };
        }
      } catch (e) {
        // non-blocking; rely on server values
        console.warn('Client-side streak computation skipped:', e);
      }

      const githubData = aggregate;
      setData(githubData);
      setLastUpdated(new Date());
      setError(null);

    } catch (err) {
      console.error('Error fetching GitHub stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch GitHub data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refetch data manually
   */
  const refetch = useCallback(async () => {
    await fetchGitHubStats();
  }, [fetchGitHubStats]);

  // Initial data fetch
  useEffect(() => {
    fetchGitHubStats();
  }, [fetchGitHubStats]);

  return {
    data,
    isLoading,
    error,
    refetch,
    lastUpdated,
  };
}

/**
 * Hook for fetching GitHub data with custom options
 */
export function useGitHubStatsWithOptions(options: {
  autoRefresh?: boolean;
  refreshInterval?: number;
  retryAttempts?: number;
  retryDelay?: number;
} = {}): UseGitHubStatsReturn & {
  isRefreshing: boolean;
  retryCount: number;
} {
  const {
    autoRefresh = false,
    refreshInterval = 300000, // 5 minutes
    retryAttempts = 3,
    retryDelay = 1000,
  } = options;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const baseHook = useGitHubStats();

  /**
   * Enhanced refetch with retry logic
   */
  const enhancedRefetch = useCallback(async () => {
    setIsRefreshing(true);
    setRetryCount(0);

    let attempts = 0;
    while (attempts < retryAttempts) {
      try {
        await baseHook.refetch();
        setRetryCount(attempts);
        break;
      } catch (error) {
        attempts++;
        setRetryCount(attempts);
        
        if (attempts < retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempts));
        } else {
          console.error('Max retry attempts reached for GitHub stats');
        }
      }
    }

    setIsRefreshing(false);
  }, [baseHook.refetch, retryAttempts, retryDelay]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (!baseHook.isLoading && !isRefreshing) {
        enhancedRefetch();
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, baseHook.isLoading, isRefreshing, enhancedRefetch]);

  return {
    ...baseHook,
    refetch: enhancedRefetch,
    isRefreshing,
    retryCount,
  };
}

/**
 * Hook for GitHub statistics with caching
 */
export function useGitHubStatsWithCache(cacheKey: string = 'github-stats'): UseGitHubStatsReturn & {
  clearCache: () => void;
  isCached: boolean;
} {
  const [isCached, setIsCached] = useState(false);
  const baseHook = useGitHubStats();

  /**
   * Load data from cache
   */
  const loadFromCache = useCallback(() => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const cacheAge = Date.now() - timestamp;
        
        // Cache valid for 1 hour
        if (cacheAge < 3600000) {
          setIsCached(true);
          return data;
        }
      }
    } catch (error) {
      console.warn('Failed to load GitHub stats from cache:', error);
    }
    return null;
  }, [cacheKey]);

  /**
   * Save data to cache
   */
  const saveToCache = useCallback((data: GitHubData) => {
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.warn('Failed to save GitHub stats to cache:', error);
    }
  }, [cacheKey]);

  /**
   * Clear cache
   */
  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(cacheKey);
      setIsCached(false);
    } catch (error) {
      console.warn('Failed to clear GitHub stats cache:', error);
    }
  }, [cacheKey]);

  // Load from cache on mount
  useEffect(() => {
    const cachedData = loadFromCache();
    if (cachedData && !baseHook.data) {
      // Use cached data temporarily while fresh data loads
      setIsCached(true);
    }
  }, [loadFromCache, baseHook.data]);

  // Save to cache when data updates
  useEffect(() => {
    if (baseHook.data && !baseHook.isLoading && !baseHook.error) {
      saveToCache(baseHook.data);
      setIsCached(false); // Mark as fresh data
    }
  }, [baseHook.data, baseHook.isLoading, baseHook.error, saveToCache]);

  return {
    ...baseHook,
    clearCache,
    isCached,
  };
}
