/**
 * Custom hook for fetching and managing GitHub contribution data
 * Handles contribution calendar data with fallback to mock data
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  GitHubContributionCalendar, 
  GitHubContribution, 
  UseGitHubContributionsReturn, 
  GITHUB_API_ENDPOINTS 
} from '@/types/github';
import {
  calculateTotalContributions,
  calculateContributionStreaks
} from '@/utils/githubCalculations';
import { githubService } from '@/services/githubService';

/**
 * Hook for managing GitHub contribution data
 */
export function useGitHubContributions(year?: number): UseGitHubContributionsReturn {
  const [contributions, setContributions] = useState<GitHubContributionCalendar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const targetYear = year || new Date().getFullYear();

  /**
   * Fetch contribution data using GitHub service
   */
  const fetchContributions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to use the GitHub service first
      const result = await githubService.fetchContributions(targetYear);

      if (result.success && result.data) {
        setContributions(result.data);
        setLastUpdated(new Date());
        setError(null);
        return;
      }

      // Fallback to API endpoint if service fails
      const response = await fetch(
        `${GITHUB_API_ENDPOINTS.CONTRIBUTIONS}?year=${targetYear}`
      );

      if (response.ok) {
        const data = await response.json();

        if (data.success && data.contributions) {
          setContributions(data.contributions);
          setLastUpdated(new Date());
          setError(null);
          return;
        }
      }

      // If both fail, set error state
      console.warn('GitHub contributions API unavailable');
      setError('Unable to fetch contribution data. Please check your connection.');

    } catch (err) {
      console.error('Error fetching GitHub contributions:', err);
      setError('Failed to fetch contribution data');
    } finally {
      setIsLoading(false);
    }
  }, [targetYear]);

  /**
   * Refetch contribution data
   */
  const refetch = useCallback(async () => {
    await fetchContributions();
  }, [fetchContributions]);

  // Initial data fetch
  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  return {
    contributions,
    isLoading,
    error,
    refetch,
    lastUpdated,
  };
}

/**
 * Transform contribution array to calendar format
 */
function transformContributionsToCalendar(
  contributions: GitHubContribution[], 
  year: number
): GitHubContributionCalendar {
  const weeks: any[] = [];
  const months: any[] = [];
  
  // Group contributions by weeks
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  
  // Find the first Sunday of the year or before
  const firstSunday = new Date(startDate);
  firstSunday.setDate(startDate.getDate() - startDate.getDay());
  
  let currentDate = new Date(firstSunday);
  let weekIndex = 0;
  
  while (currentDate <= endDate) {
    const week = {
      contributionDays: [] as GitHubContribution[],
      firstDay: currentDate.toISOString().split('T')[0],
    };
    
    // Add 7 days to the week
    for (let day = 0; day < 7; day++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const contribution = contributions.find(c => c.date === dateStr) || {
        date: dateStr,
        count: 0,
        level: 0,
      };
      
      week.contributionDays.push(contribution);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    weeks.push(week);
    weekIndex++;
    
    // Break if we've gone past the year
    if (currentDate.getFullYear() > year) {
      break;
    }
  }
  
  // Generate month information
  for (let month = 0; month < 12; month++) {
    const monthDate = new Date(year, month, 1);
    months.push({
      name: monthDate.toLocaleDateString('en-US', { month: 'long' }),
      year,
      firstDay: monthDate.toISOString().split('T')[0],
      totalWeeks: Math.ceil(new Date(year, month + 1, 0).getDate() / 7),
    });
  }
  
  const totalContributions = calculateTotalContributions(contributions);
  
  return {
    totalContributions,
    weeks,
    months,
  };
}

/**
 * Hook for contribution data with enhanced features
 */
export function useGitHubContributionsWithStats(year?: number): UseGitHubContributionsReturn & {
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

  // Calculate enhanced statistics
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

    const allContributions = baseHook.contributions.weeks.flatMap(week => week.contributionDays);
    const totalContributions = calculateTotalContributions(allContributions);
    const { currentStreak, longestStreak } = calculateContributionStreaks(allContributions);
    
    const activeDays = allContributions.filter(c => c.count > 0).length;
    const averagePerDay = totalContributions / Math.max(allContributions.length, 1);
    const bestDay = allContributions.reduce((best, current) => 
      current.count > (best?.count || 0) ? current : best, null as GitHubContribution | null
    );

    setStats({
      totalContributions,
      currentStreak,
      longestStreak,
      averagePerDay,
      bestDay,
      activeDays,
    });
  }, [baseHook.contributions]);

  return {
    ...baseHook,
    stats,
  };
}

/**
 * Hook for multiple years of contribution data
 */
export function useGitHubContributionsMultiYear(years: number[]): {
  contributionsByYear: Record<number, GitHubContributionCalendar | null>;
  isLoading: boolean;
  errors: Record<number, string | null>;
  refetchAll: () => Promise<void>;
} {
  const [contributionsByYear, setContributionsByYear] = useState<Record<number, GitHubContributionCalendar | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<number, string | null>>({});

  const fetchAllYears = useCallback(async () => {
    setIsLoading(true);
    const newContributions: Record<number, GitHubContributionCalendar | null> = {};
    const newErrors: Record<number, string | null> = {};

    await Promise.all(
      years.map(async (year) => {
        try {
          const response = await fetch(
            `${GITHUB_API_ENDPOINTS.CONTRIBUTIONS}?year=${year}`
          );

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.contributions) {
              newContributions[year] = data.contributions;
              newErrors[year] = null;
              return;
            }
          }

          // Set error state if API fails
          newContributions[year] = null;
          newErrors[year] = 'Unable to fetch contribution data';

        } catch (error) {
          console.error(`Error fetching contributions for ${year}:`, error);
          newContributions[year] = null;
          newErrors[year] = 'Failed to fetch contribution data';
        }
      })
    );

    setContributionsByYear(newContributions);
    setErrors(newErrors);
    setIsLoading(false);
  }, [years]);

  const refetchAll = useCallback(async () => {
    await fetchAllYears();
  }, [fetchAllYears]);

  useEffect(() => {
    fetchAllYears();
  }, [fetchAllYears]);

  return {
    contributionsByYear,
    isLoading,
    errors,
    refetchAll,
  };
}
