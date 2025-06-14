/**
 * GitHub data calculation utilities
 * Handles all GitHub statistics calculations and data transformations
 */

import { GitHubRepo, GitHubProfile, GitHubStats, GitHubLanguage, GitHubContribution, GitHubActivity } from '@/types/github';

/**
 * Calculate comprehensive GitHub statistics from profile and repositories
 */
export function calculateGitHubStats(
  profile: GitHubProfile,
  repositories: GitHubRepo[]
): GitHubStats {
  const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);
  const totalRepos = repositories.length;
  const contributedRepos = repositories.filter(repo => !repo.fork).length;
  
  // Calculate years of coding based on account creation
  const createdDate = new Date(profile.created_at);
  const now = new Date();
  const yearOfCoding = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25));

  return {
    totalStars,
    totalForks,
    totalRepos,
    totalCommits: 0, // Requires additional API calls or GraphQL
    totalPRs: 0, // Requires additional API calls or GraphQL
    totalIssues: 0, // Requires additional API calls or GraphQL
    contributedRepos,
    yearOfCoding,
    currentStreak: 0, // Requires contribution data
    longestStreak: 0, // Requires contribution data
    totalContributions: 0, // Requires contribution data
  };
}

/**
 * Calculate language distribution from repositories
 */
export async function calculateLanguageDistribution(
  repositories: GitHubRepo[]
): Promise<GitHubLanguage[]> {
  const languageCount: Record<string, number> = {};
  const languageColors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#239120',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#ffac45',
    Kotlin: '#F18E33',
    Dart: '#00B4AB',
    HTML: '#e34c26',
    CSS: '#1572B6',
    SCSS: '#c6538c',
    Vue: '#4FC08D',
    React: '#61DAFB',
    Angular: '#DD0031',
    Svelte: '#ff3e00',
    Shell: '#89e051',
    PowerShell: '#012456',
    Dockerfile: '#384d54',
    YAML: '#cb171e',
    JSON: '#292929',
    Markdown: '#083fa1',
  };

  // Count languages from repositories
  repositories.forEach(repo => {
    if (repo.language) {
      languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
    }
  });

  const total = Object.values(languageCount).reduce((sum, count) => sum + count, 0);

  return Object.entries(languageCount)
    .map(([name, count]) => ({
      name,
      value: count,
      color: languageColors[name] || '#858585',
      percentage: Math.round((count / total) * 100),
      bytes: count * 1000, // Approximation since we don't have actual byte counts
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Top 8 languages
}

/**
 * Get top repositories based on stars, forks, and recent activity
 */
export function getTopRepositories(repositories: GitHubRepo[], limit: number = 6): GitHubRepo[] {
  return repositories
    .filter(repo => !repo.fork) // Exclude forked repositories
    .sort((a, b) => {
      // Sort by stars first, then by forks, then by recent activity
      const scoreA = a.stargazers_count * 3 + a.forks_count * 2 + (a.updated_at ? 1 : 0);
      const scoreB = b.stargazers_count * 3 + b.forks_count * 2 + (b.updated_at ? 1 : 0);
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

/**
 * Generate recent activity from repositories
 */
export function generateRecentActivity(repositories: GitHubRepo[]): GitHubActivity[] {
  const activities: GitHubActivity[] = [];

  repositories
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 10)
    .forEach(repo => {
      activities.push({
        type: 'commit',
        repo: repo.full_name,
        date: repo.updated_at,
        description: `Updated ${repo.name}`,
        url: repo.html_url,
      });

      if (repo.stargazers_count > 0) {
        activities.push({
          type: 'star',
          repo: repo.full_name,
          date: repo.created_at,
          description: `${repo.name} received ${repo.stargazers_count} stars`,
          url: repo.html_url,
        });
      }
    });

  return activities
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 15);
}

/**
 * Calculate contribution streaks from contribution data
 */
export function calculateContributionStreaks(contributions: GitHubContribution[]): {
  currentStreak: number;
  longestStreak: number;
} {
  if (!contributions.length) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Sort contributions by date (newest first)
  const sortedContributions = contributions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate current streak (from today backwards)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedContributions.length; i++) {
    const contributionDate = new Date(sortedContributions[i].date);
    contributionDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today.getTime() - contributionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === i && sortedContributions[i].count > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate longest streak
  for (const contribution of sortedContributions) {
    if (contribution.count > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  return { currentStreak, longestStreak };
}

/**
 * Transform contribution data for Cal-Heatmap
 */
export function transformContributionsForHeatmap(contributions: GitHubContribution[]): Record<string, number> {
  const heatmapData: Record<string, number> = {};
  
  contributions.forEach(contribution => {
    // Cal-Heatmap expects timestamp in seconds
    const timestamp = Math.floor(new Date(contribution.date).getTime() / 1000);
    heatmapData[timestamp] = contribution.count;
  });

  return heatmapData;
}

/**
 * Generate mock contribution data for fallback
 */
export function generateMockContributions(year: number = new Date().getFullYear()): GitHubContribution[] {
  const contributions: GitHubContribution[] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const count = Math.floor(Math.random() * 15);
    const level = count === 0 ? 0 : Math.min(Math.floor(count / 3) + 1, 4);
    
    contributions.push({
      date: date.toISOString().split('T')[0],
      count,
      level,
    });
  }

  return contributions;
}

/**
 * Calculate total contributions from contribution data
 */
export function calculateTotalContributions(contributions: GitHubContribution[]): number {
  return contributions.reduce((total, contribution) => total + contribution.count, 0);
}

/**
 * Format large numbers for display
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Calculate repository health score
 */
export function calculateRepoHealthScore(repo: GitHubRepo): number {
  let score = 0;
  
  // Has description
  if (repo.description) score += 10;
  
  // Has topics
  if (repo.topics && repo.topics.length > 0) score += 10;
  
  // Has license
  if (repo.license) score += 15;
  
  // Has README (approximated by description presence)
  if (repo.description && repo.description.length > 20) score += 15;
  
  // Recent activity (updated within last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  if (new Date(repo.updated_at) > sixMonthsAgo) score += 20;
  
  // Community engagement (stars + forks)
  const engagement = repo.stargazers_count + repo.forks_count;
  if (engagement > 0) score += Math.min(engagement * 2, 30);
  
  return Math.min(score, 100);
}

/**
 * Get contribution level color class
 */
export function getContributionLevelColor(level: number): string {
  const colors = {
    0: 'bg-gray-100 dark:bg-gray-800',
    1: 'bg-green-200 dark:bg-green-900',
    2: 'bg-green-300 dark:bg-green-700',
    3: 'bg-green-400 dark:bg-green-600',
    4: 'bg-green-500 dark:bg-green-500',
  };
  
  return colors[level as keyof typeof colors] || colors[0];
}
