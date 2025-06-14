/**
 * GitHub API Service - Real-time data fetching with authentication
 * Provides comprehensive GitHub data integration with caching and error handling
 */

import { GitHubProfile, GitHubRepo, GitHubContribution, GitHubContributionCalendar } from '@/types/github';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxRequests: 5000, // GitHub authenticated rate limit
  windowMs: 60 * 60 * 1000, // 1 hour
  retryAfter: 60 * 1000, // 1 minute retry delay
};

// Cache configuration
const CACHE_CONFIG = {
  profile: 24 * 60 * 60 * 1000, // 24 hours
  repos: 60 * 60 * 1000, // 1 hour
  contributions: 60 * 60 * 1000, // 1 hour
  stats: 30 * 60 * 1000, // 30 minutes
};

// Enhanced types for GitHub API responses
export interface GitHubAPIError {
  message: string;
  documentation_url?: string;
  status?: number;
}

export interface GitHubRateLimit {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
}

export interface GitHubAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  rateLimit?: GitHubRateLimit;
  cached?: boolean;
  cacheAge?: number;
}

// Legacy interface for backward compatibility
export interface GithubUserStats {
  name: string;
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  bio: string;
}

/**
 * GitHub API Service Class
 * Handles all GitHub API interactions with authentication, caching, and error handling
 */
export class GitHubAPIService {
  private token: string;
  private username: string;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private rateLimitInfo: GitHubRateLimit | null = null;

  constructor(token?: string, username?: string) {
    this.token = token || process.env.GITHUB_TOKEN || '';
    this.username = username || process.env.GITHUB_USERNAME || 'GreenHacker420';

    // Debug logging for token availability
    console.log('GitHub Service initialized:', {
      hasToken: !!this.token,
      tokenLength: this.token ? this.token.length : 0,
      username: this.username,
      envTokenExists: !!process.env.GITHUB_TOKEN,
      envUsernameExists: !!process.env.GITHUB_USERNAME
    });

    if (!this.token) {
      console.warn('GitHub token not provided. API calls will be limited.');
    }
  }

  /**
   * Get authentication headers for GitHub API
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-App/1.0',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Get GraphQL headers for GitHub API
   */
  private getGraphQLHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Portfolio-App/1.0',
    };
  }

  /**
   * Check and update rate limit information
   */
  private updateRateLimit(response: Response): void {
    const limit = response.headers.get('x-ratelimit-limit');
    const remaining = response.headers.get('x-ratelimit-remaining');
    const reset = response.headers.get('x-ratelimit-reset');
    const used = response.headers.get('x-ratelimit-used');

    if (limit && remaining && reset && used) {
      this.rateLimitInfo = {
        limit: parseInt(limit),
        remaining: parseInt(remaining),
        reset: parseInt(reset),
        used: parseInt(used),
      };
    }
  }

  /**
   * Get cached data if available and not expired
   */
  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data as T;
    }
    return null;
  }

  /**
   * Set data in cache with TTL
   */
  private setCachedData(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Clear cache for specific key or all cache
   */
  public clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get current rate limit information
   */
  public getRateLimit(): GitHubRateLimit | null {
    return this.rateLimitInfo;
  }

  /**
   * Fetch user profile information
   */
  public async fetchProfile(forceRefresh = false): Promise<GitHubAPIResponse<GitHubProfile>> {
    const cacheKey = `profile-${this.username}`;
    
    if (!forceRefresh) {
      const cached = this.getCachedData<GitHubProfile>(cacheKey);
      if (cached) {
        return {
          success: true,
          data: cached,
          cached: true,
          cacheAge: Date.now() - (this.cache.get(cacheKey)?.timestamp || 0),
        };
      }
    }

    try {
      const response = await fetch(`${GITHUB_API_BASE}/users/${this.username}`, {
        headers: this.getHeaders(),
      });

      this.updateRateLimit(response);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: `GitHub API error: ${response.status} - ${errorData.message || 'Unknown error'}`,
          rateLimit: this.rateLimitInfo,
        };
      }

      const userData = await response.json();
      
      // Map to our GitHubProfile interface - using partial mapping for now
      const profileData: Partial<GitHubProfile> = {
        id: userData.id,
        login: userData.login,
        name: userData.name || userData.login,
        bio: userData.bio || '',
        avatar_url: userData.avatar_url,
        html_url: userData.html_url,
        public_repos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
        location: userData.location || '',
        blog: userData.blog || '',
        twitter_username: userData.twitter_username || '',
        company: userData.company || '',
      };

      this.setCachedData(cacheKey, profileData, CACHE_CONFIG.profile);

      return {
        success: true,
        data: profileData as GitHubProfile,
        rateLimit: this.rateLimitInfo,
        cached: false,
      };
    } catch (error) {
      console.error('Error fetching GitHub profile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        rateLimit: this.rateLimitInfo,
      };
    }
  }

  /**
   * Fetch user repositories
   */
  public async fetchRepositories(forceRefresh = false, page = 1, perPage = 100): Promise<GitHubAPIResponse<GitHubRepo[]>> {
    const cacheKey = `repos-${this.username}-${page}-${perPage}`;

    if (!forceRefresh) {
      const cached = this.getCachedData<GitHubRepo[]>(cacheKey);
      if (cached) {
        return {
          success: true,
          data: cached,
          cached: true,
          cacheAge: Date.now() - (this.cache.get(cacheKey)?.timestamp || 0),
        };
      }
    }

    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/users/${this.username}/repos?sort=updated&per_page=${perPage}&page=${page}`,
        {
          headers: this.getHeaders(),
        }
      );

      this.updateRateLimit(response);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: `GitHub API error: ${response.status} - ${errorData.message || 'Unknown error'}`,
          rateLimit: this.rateLimitInfo,
        };
      }

      const reposData = await response.json();

      const repositories: GitHubRepo[] = reposData.map((repo: any) => ({
        id: repo.id,
        node_id: repo.node_id,
        name: repo.name,
        full_name: repo.full_name,
        private: repo.private,
        owner: {
          login: repo.owner.login,
          id: repo.owner.id,
          avatar_url: repo.owner.avatar_url,
          html_url: repo.owner.html_url,
        },
        html_url: repo.html_url,
        description: repo.description || '',
        fork: repo.fork,
        url: repo.url,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
        git_url: repo.git_url,
        ssh_url: repo.ssh_url,
        clone_url: repo.clone_url,
        homepage: repo.homepage || '',
        size: repo.size,
        stargazers_count: repo.stargazers_count,
        watchers_count: repo.watchers_count,
        language: repo.language || '',
        has_issues: repo.has_issues,
        has_projects: repo.has_projects,
        has_wiki: repo.has_wiki,
        has_pages: repo.has_pages,
        forks_count: repo.forks_count,
        archived: repo.archived,
        disabled: repo.disabled,
        open_issues_count: repo.open_issues_count,
        license: repo.license ? {
          key: repo.license.key,
          name: repo.license.name,
          spdx_id: repo.license.spdx_id,
          url: repo.license.url,
        } : null,
        allow_forking: repo.allow_forking,
        is_template: repo.is_template,
        topics: repo.topics || [],
        visibility: repo.visibility,
        forks: repo.forks,
        open_issues: repo.open_issues,
        watchers: repo.watchers,
        default_branch: repo.default_branch,
      }));

      this.setCachedData(cacheKey, repositories, CACHE_CONFIG.repos);

      return {
        success: true,
        data: repositories,
        rateLimit: this.rateLimitInfo,
        cached: false,
      };
    } catch (error) {
      console.error('Error fetching GitHub repositories:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        rateLimit: this.rateLimitInfo,
      };
    }
  }

  /**
   * Fetch contribution calendar data using GraphQL API
   */
  public async fetchContributions(year: number, forceRefresh = false): Promise<GitHubAPIResponse<GitHubContributionCalendar>> {
    if (!this.token) {
      return {
        success: false,
        error: 'GitHub token required for contribution data',
      };
    }

    const cacheKey = `contributions-${this.username}-${year}`;

    if (!forceRefresh) {
      const cached = this.getCachedData<GitHubContributionCalendar>(cacheKey);
      if (cached) {
        return {
          success: true,
          data: cached,
          cached: true,
          cacheAge: Date.now() - (this.cache.get(cacheKey)?.timestamp || 0),
        };
      }
    }

    const startDate = new Date(year, 0, 1).toISOString();
    const endDate = new Date(year, 11, 31).toISOString();

    const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            totalCommitContributions
            totalIssueContributions
            totalPullRequestContributions
            totalPullRequestReviewContributions
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                }
                firstDay
              }
              months {
                name
                year
                firstDay
                totalWeeks
              }
            }
          }
        }
      }
    `;

    try {
      const response = await fetch(GITHUB_GRAPHQL_API, {
        method: 'POST',
        headers: this.getGraphQLHeaders(),
        body: JSON.stringify({
          query,
          variables: {
            username: this.username,
            from: startDate,
            to: endDate,
          },
        }),
      });

      this.updateRateLimit(response);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: `GitHub GraphQL API error: ${response.status} - ${errorData.message || 'Unknown error'}`,
          rateLimit: this.rateLimitInfo,
        };
      }

      const result = await response.json();

      if (result.errors) {
        return {
          success: false,
          error: `GraphQL errors: ${result.errors.map((e: any) => e.message).join(', ')}`,
          rateLimit: this.rateLimitInfo,
        };
      }

      const contributionsData = result.data?.user?.contributionsCollection;
      if (!contributionsData) {
        return {
          success: false,
          error: 'No contribution data found',
          rateLimit: this.rateLimitInfo,
        };
      }

      // Helper function to convert GitHub contribution level to numeric value
      const convertContributionLevel = (level: string): number => {
        switch (level) {
          case 'NONE': return 0;
          case 'FIRST_QUARTILE': return 1;
          case 'SECOND_QUARTILE': return 2;
          case 'THIRD_QUARTILE': return 3;
          case 'FOURTH_QUARTILE': return 4;
          default: return 0;
        }
      };

      const calendar = contributionsData.contributionCalendar;
      const contributionCalendar: GitHubContributionCalendar = {
        totalContributions: calendar.totalContributions,
        weeks: calendar.weeks.map((week: any) => ({
          contributionDays: week.contributionDays.map((day: any) => ({
            date: day.date,
            count: day.contributionCount,
            level: convertContributionLevel(day.contributionLevel),
          })),
          firstDay: week.firstDay,
        })),
        months: calendar.months,
      };

      this.setCachedData(cacheKey, contributionCalendar, CACHE_CONFIG.contributions);

      return {
        success: true,
        data: contributionCalendar,
        rateLimit: this.rateLimitInfo,
        cached: false,
      };
    } catch (error) {
      console.error('Error fetching GitHub contributions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        rateLimit: this.rateLimitInfo,
      };
    }
  }
}

// Create a singleton instance of the GitHub API service
// Use a factory function to ensure environment variables are available
let _githubServiceInstance: GitHubAPIService | null = null;

export function getGitHubService(): GitHubAPIService {
  if (!_githubServiceInstance) {
    _githubServiceInstance = new GitHubAPIService(
      process.env.GITHUB_TOKEN,
      process.env.GITHUB_USERNAME
    );
  }
  return _githubServiceInstance;
}

// Export the service instance for backward compatibility
export const githubService = getGitHubService();

// Utility functions
export const calculateTotalStars = (repos: GitHubRepo[]): number => {
  return repos.reduce((total, repo) => total + repo.stargazers_count, 0);
};

export const getTopRepos = (repos: GitHubRepo[], count: number = 5): GitHubRepo[] => {
  return [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, count);
};
