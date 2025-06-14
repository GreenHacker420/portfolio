/**
 * Custom hook for fetching and managing GitHub statistics data
 * Provides comprehensive GitHub data with caching and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import { GitHubData, GitHubAPIResponse, UseGitHubStatsReturn, GITHUB_API_ENDPOINTS } from '@/types/github';
import { calculateGitHubStats, calculateLanguageDistribution, getTopRepositories, generateRecentActivity } from '@/utils/githubCalculations';

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

      // Fetch profile and repositories in parallel
      const [profileResponse, reposResponse] = await Promise.all([
        fetch(GITHUB_API_ENDPOINTS.USER),
        fetch(GITHUB_API_ENDPOINTS.REPOS + '?per_page=100'),
      ]);

      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        console.error('Profile API error:', profileResponse.status, errorText);
        throw new Error(`Failed to fetch profile: ${profileResponse.status}`);
      }

      if (!reposResponse.ok) {
        const errorText = await reposResponse.text();
        console.error('Repos API error:', reposResponse.status, errorText);
        throw new Error(`Failed to fetch repositories: ${reposResponse.status}`);
      }

      const profileData: GitHubAPIResponse<any> = await profileResponse.json();
      const reposData: GitHubAPIResponse<any[]> = await reposResponse.json();

      if (!profileData.success || !reposData.success) {
        console.error('API response structure error:', { profileData, reposData });
        throw new Error(`API returned error response: ${profileData.error || reposData.error || 'Unknown error'}`);
      }

      const profile = profileData.data!;
      const repositories = reposData.data!;

      // Calculate derived data
      const stats = calculateGitHubStats(profile, repositories);
      const languages = await calculateLanguageDistribution(repositories);
      const topRepositories = getTopRepositories(repositories);
      const recentActivity = generateRecentActivity(repositories);

      // Create comprehensive GitHub data object
      const githubData: GitHubData = {
        profile,
        repositories,
        stats,
        languages,
        contributions: {
          totalContributions: 0,
          weeks: [],
          months: [],
        }, // Will be populated by useGitHubContributions hook
        recentActivity,
        topRepositories,
      };

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
