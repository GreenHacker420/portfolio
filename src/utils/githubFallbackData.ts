/**
 * Fallback data generator for GitHub contributions when API is rate limited
 * Provides realistic-looking contribution data for development and testing
 */

import { GitHubContributionCalendar, GitHubContribution } from '@/types/github';

/**
 * Generates realistic fallback contribution data for a given year
 * @param year - Target year for contribution data
 * @returns GitHubContributionCalendar with simulated data
 */
export function generateFallbackContributions(year: number): GitHubContributionCalendar {
  const weeks: any[] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  
  // Find the first Sunday of the year or before
  const firstSunday = new Date(startDate);
  firstSunday.setDate(startDate.getDate() - startDate.getDay());
  
  let currentDate = new Date(firstSunday);
  let totalContributions = 0;
  
  while (currentDate <= endDate) {
    const week = {
      contributionDays: [] as GitHubContribution[],
      firstDay: currentDate.toISOString().split('T')[0],
    };
    
    // Add 7 days to the week
    for (let day = 0; day < 7; day++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const isCurrentYear = currentDate.getFullYear() === year;
      
      // Generate realistic contribution patterns
      let count = 0;
      let level = 0;
      
      if (isCurrentYear) {
        // Simulate realistic contribution patterns
        const dayOfWeek = currentDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isHoliday = isHolidayPeriod(currentDate);
        
        // Lower activity on weekends and holidays
        const baseActivity = isWeekend ? 0.3 : isHoliday ? 0.2 : 0.7;
        
        // Random contribution count with realistic distribution
        const random = Math.random();
        if (random < baseActivity) {
          if (random < 0.1) count = Math.floor(Math.random() * 15) + 10; // High activity days
          else if (random < 0.3) count = Math.floor(Math.random() * 8) + 3; // Medium activity
          else count = Math.floor(Math.random() * 3) + 1; // Low activity
        }
        
        // Calculate level based on count
        if (count === 0) level = 0;
        else if (count <= 3) level = 1;
        else if (count <= 6) level = 2;
        else if (count <= 10) level = 3;
        else level = 4;
        
        totalContributions += count;
      }
      
      week.contributionDays.push({
        date: dateStr,
        count,
        level,
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    weeks.push(week);
    
    // Break if we've gone past the year
    if (currentDate.getFullYear() > year) {
      break;
    }
  }
  
  return {
    totalContributions,
    weeks,
    months: generateMonthData(year),
  };
}

/**
 * Checks if a date falls in a typical holiday period
 * @param date - Date to check
 * @returns Whether the date is in a holiday period
 */
function isHolidayPeriod(date: Date): boolean {
  const month = date.getMonth();
  const day = date.getDate();
  
  // Christmas/New Year period
  if ((month === 11 && day > 20) || (month === 0 && day < 7)) return true;
  
  // Summer vacation period (July-August)
  if (month === 6 || month === 7) return true;
  
  // Thanksgiving week (US)
  if (month === 10 && day > 20 && day < 28) return true;
  
  return false;
}

/**
 * Generates month data for the calendar
 * @param year - Target year
 * @returns Array of month information
 */
function generateMonthData(year: number) {
  const months = [];
  
  for (let month = 0; month < 12; month++) {
    const monthDate = new Date(year, month, 1);
    months.push({
      name: monthDate.toLocaleDateString('en-US', { month: 'long' }),
      year,
      firstDay: monthDate.toISOString().split('T')[0],
      totalWeeks: Math.ceil(new Date(year, month + 1, 0).getDate() / 7),
    });
  }
  
  return months;
}

/**
 * Creates a rate limit aware message for users
 * @param retryAfter - Seconds until rate limit resets
 * @returns User-friendly message
 */
export function createRateLimitMessage(retryAfter?: number): string {
  const baseMessage = "GitHub API rate limit reached. ";
  
  if (retryAfter) {
    const minutes = Math.ceil(retryAfter / 60);
    return `${baseMessage}Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`;
  }
  
  return `${baseMessage}Please wait a moment before trying again.`;
}

/**
 * Checks if we should use fallback data based on error type
 * @param error - Error from API call
 * @returns Whether to use fallback data
 */
export function shouldUseFallbackData(error: any): boolean {
  // Use fallback for rate limiting
  if (error?.status === 429) return true;
  
  // Use fallback for network errors
  if (error?.code === 'NETWORK_ERROR') return true;
  
  // Use fallback for timeout errors
  if (error?.code === 'TIMEOUT') return true;
  
  return false;
}

/**
 * Enhanced fallback data with more realistic patterns
 * @param year - Target year
 * @param userPattern - Optional user activity pattern
 * @returns Enhanced contribution calendar
 */
export function generateEnhancedFallbackContributions(
  year: number,
  userPattern: 'active' | 'moderate' | 'light' = 'moderate'
): GitHubContributionCalendar {
  const baseData = generateFallbackContributions(year);
  
  // Adjust activity based on user pattern
  const multiplier = {
    active: 1.5,
    moderate: 1.0,
    light: 0.6,
  }[userPattern];
  
  // Apply pattern multiplier
  baseData.weeks.forEach(week => {
    week.contributionDays.forEach((day: GitHubContribution) => {
      if (day.count > 0) {
        day.count = Math.max(1, Math.floor(day.count * multiplier));
        
        // Recalculate level
        if (day.count <= 3) day.level = 1;
        else if (day.count <= 6) day.level = 2;
        else if (day.count <= 10) day.level = 3;
        else day.level = 4;
      }
    });
  });
  
  // Recalculate total
  baseData.totalContributions = baseData.weeks
    .flatMap(week => week.contributionDays)
    .reduce((sum, day) => sum + day.count, 0);
  
  return baseData;
}

/**
 * Cache key generator for fallback data
 * @param year - Target year
 * @param pattern - User pattern
 * @returns Cache key string
 */
export function getFallbackCacheKey(year: number, pattern: string = 'moderate'): string {
  return `fallback_${year}_${pattern}`;
}
