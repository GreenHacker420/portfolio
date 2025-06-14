/**
 * Custom hook for fetching and managing GitHub contribution data
 * Uses incremental synchronization with persistent caching
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  GitHubContributionCalendar,
  GitHubContribution,
  UseGitHubContributionsReturn
} from '@/types/github';
import {
  calculateTotalContributions,
  calculateContributionStreaks
} from '@/utils/githubCalculations';

/**
 * API response interface
 */
interface GitHubContributionsAPIResponse {
  success: boolean;
  contributions?: GitHubContributionCalendar;
  year: number;
  cached?: boolean;
  stale?: boolean;
  age?: number;
  source?: 'cache' | 'api' | 'stale-cache' | 'edge';
  cacheAge?: number;
  rateLimit?: any;
  timestamp: string;
  error?: string;
  mock?: boolean;
}

/**
 * Enhanced hook state interface
 */
interface EnhancedHookState {
  contributions: GitHubContributionCalendar | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isFresh: boolean;
  source: 'api' | 'cache' | 'stale-cache' | 'edge' | 'merged';
  cacheStatus: 'hit' | 'miss' | 'stale' | 'invalid' | 'edge-hit';
  retryAfter?: number;
  age?: number;
}

/**
 * Enhanced return type for the hook
 */
interface EnhancedUseGitHubContributionsReturn extends UseGitHubContributionsReturn {
  isFresh: boolean;
  source: string;
  cacheStatus: string;
  retryAfter?: number;
  age?: number;
  refresh: () => Promise<void>;
}

/**
 * Custom hook for GitHub contribution data using API routes
 * @param year - Target year for contributions (defaults to current year)
 * @returns Enhanced hook state with API information
 */
export function useGitHubContributions(
  year?: number
): EnhancedUseGitHubContributionsReturn {
  const targetYear = year || new Date().getFullYear();
  const fetchInProgress = useRef(false);
  const mountedRef = useRef(true);

  const [state, setState] = useState<EnhancedHookState>({
    contributions: null,
    isLoading: true,
    error: null,
    lastUpdated: null,
    isFresh: false,
    source: 'api',
    cacheStatus: 'miss',
    age: 0,
  });

  /**
   * Fetch contributions data from API route
   */
  const fetchContributions = useCallback(async (forceRefresh = false) => {
    if (fetchInProgress.current) return;

    fetchInProgress.current = true;

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const url = new URL('/api/github/contributions', window.location.origin);
      url.searchParams.set('year', targetYear.toString());
      if (forceRefresh) {
        url.searchParams.set('refresh', 'true');
      }
      // Enable edge cache by default
      url.searchParams.set('edge', 'true');

      const response = await fetch(url.toString());
      const data: GitHubContributionsAPIResponse = await response.json();

      if (!mountedRef.current) return;

      if (data.success && data.contributions) {
        // Determine cache status based on source and staleness
        let cacheStatus: 'hit' | 'miss' | 'stale' | 'edge-hit' = 'miss';
        if (data.source === 'edge') {
          cacheStatus = 'edge-hit';
        } else if (data.cached) {
          cacheStatus = data.stale ? 'stale' : 'hit';
        }

        setState(prev => ({
          ...prev,
          contributions: data.contributions || null,
          isLoading: false,
          error: null,
          lastUpdated: new Date(),
          isFresh: !data.cached && !data.stale,
          source: data.source || (data.cached ? 'cache' : 'api'),
          cacheStatus,
          age: data.age || 0,
        }));
      } else {
        setState(prev => ({
          ...prev,
          contributions: null,
          isLoading: false,
          error: data.error || 'Failed to fetch contributions',
          source: 'api',
          cacheStatus: 'miss',
          age: 0,
        }));
      }

    } catch (error) {
      if (!mountedRef.current) return;

      console.error(`Failed to fetch contributions for year ${targetYear}:`, error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch contributions',
      }));
    } finally {
      fetchInProgress.current = false;
    }
  }, [targetYear]);

  /**
   * Manual refresh function
   */
  const refresh = useCallback(async () => {
    await fetchContributions(true);
  }, [fetchContributions]);

  /**
   * Effect to fetch data when year changes
   */
  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  /**
   * Cleanup effect
   */
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    contributions: state.contributions,
    isLoading: state.isLoading,
    error: state.error,
    refetch: refresh,
    lastUpdated: state.lastUpdated,
    isFresh: state.isFresh,
    source: state.source,
    cacheStatus: state.cacheStatus,
    retryAfter: state.retryAfter,
    age: state.age,
    refresh,
  };
}

/**
 * Enhanced hook with contribution statistics
 * Provides additional statistical analysis of contribution data
 */
export function useGitHubContributionsWithStats(
  year?: number
): EnhancedUseGitHubContributionsReturn & {
  stats: {
    totalContributions: number;
    currentStreak: number;
    longestStreak: number;
    averagePerDay: number;
    bestDay: GitHubContribution | null;
    activeDays: number;
  };
} {
  const baseHook = useGitHubContributions(year);
  const [stats, setStats] = useState({
    totalContributions: 0,
    currentStreak: 0,
    longestStreak: 0,
    averagePerDay: 0,
    bestDay: null as GitHubContribution | null,
    activeDays: 0,
  });

  /**
   * Calculate enhanced statistics when contributions data changes
   */
  useEffect(() => {
    if (!baseHook.contributions) {
      setStats({
        totalContributions: 0,
        currentStreak: 0,
        longestStreak: 0,
        averagePerDay: 0,
        bestDay: null,
        activeDays: 0,
      });
      return;
    }

    try {
      // Extract all contribution days from weeks
      const allContributions = baseHook.contributions.weeks.flatMap(week =>
        week.contributionDays
      );

      // Calculate basic statistics
      const totalContributions = calculateTotalContributions(allContributions);
      const streaks = calculateContributionStreaks(allContributions);
      const activeDays = allContributions.filter(day => day.count > 0).length;
      const averagePerDay = totalContributions / Math.max(allContributions.length, 1);

      // Find the best day (highest contribution count)
      const bestDay = allContributions.reduce((best, current) =>
        current.count > (best?.count || 0) ? current : best,
        null as GitHubContribution | null
      );

      setStats({
        totalContributions,
        currentStreak: streaks.currentStreak,
        longestStreak: streaks.longestStreak,
        averagePerDay: Math.round(averagePerDay * 100) / 100,
        bestDay,
        activeDays,
      });
    } catch (error) {
      console.error('Error calculating contribution stats:', error);
      setStats({
        totalContributions: 0,
        currentStreak: 0,
        longestStreak: 0,
        averagePerDay: 0,
        bestDay: null,
        activeDays: 0,
      });
    }
  }, [baseHook.contributions]);

  return {
    ...baseHook,
    stats,
  };
}


