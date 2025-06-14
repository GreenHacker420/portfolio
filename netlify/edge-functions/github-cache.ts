/**
 * Netlify Edge Function for GitHub API Caching with Neon PostgreSQL
 * Provides intelligent caching layer for GitHub statistics and data
 */

import { Context } from "https://edge.netlify.com";
import { PrismaClient } from "@prisma/client";

// Cache configuration constants
const CACHE_DURATIONS = {
  profile: 60 * 60 * 1000, // 1 hour
  repos: 60 * 60 * 1000, // 1 hour  
  contributions: 24 * 60 * 60 * 1000, // 24 hours
  stats: 30 * 60 * 1000, // 30 minutes
} as const;

const STALE_WHILE_REVALIDATE = {
  profile: 2 * 60 * 60 * 1000, // 2 hours
  repos: 2 * 60 * 60 * 1000, // 2 hours
  contributions: 48 * 60 * 60 * 1000, // 48 hours
  stats: 60 * 60 * 1000, // 1 hour
} as const;

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxRequests: 5000,
  windowMs: 60 * 60 * 1000, // 1 hour
  retryAfter: 60 * 1000, // 1 minute
};

// GitHub API configuration
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

// Types for cache operations
interface CacheResult<T> {
  data: T | null;
  cached: boolean;
  stale: boolean;
  age: number;
  source: 'cache' | 'api' | 'stale-cache';
  error?: string;
  rateLimit?: any;
}

interface GitHubAPIError {
  message: string;
  status?: number;
  documentation_url?: string;
}

/**
 * GitHub Cache Service for Edge Functions
 */
class GitHubCacheService {
  private prisma: PrismaClient;
  private username: string;
  private token: string;

  constructor(prisma: PrismaClient, username: string, token: string) {
    this.prisma = prisma;
    this.username = username;
    this.token = token;
  }

  /**
   * Get headers for GitHub API requests
   */
  private getHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-Edge-Cache/1.0',
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }

  /**
   * Get headers for GitHub GraphQL API requests
   */
  private getGraphQLHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Portfolio-Edge-Cache/1.0',
    };
  }

  /**
   * Generate data hash for change detection
   */
  private generateDataHash(data: any): string {
    const jsonString = JSON.stringify(data, Object.keys(data).sort());
    return btoa(jsonString).slice(0, 32);
  }

  /**
   * Log cache analytics
   */
  private async logAnalytics(
    cacheType: string,
    operation: string,
    responseTime?: number,
    cacheAge?: number,
    dataSize?: number,
    errorMessage?: string,
    metadata?: any
  ): Promise<void> {
    try {
      await this.prisma.gitHubCacheAnalytics.create({
        data: {
          cacheType,
          operation,
          username: this.username,
          responseTime,
          cacheAge,
          dataSize,
          errorMessage,
          metadata: metadata ? JSON.stringify(metadata) : null,
        },
      });
    } catch (error) {
      console.error('Failed to log cache analytics:', error);
    }
  }

  /**
   * Get GitHub profile with caching
   */
  async getProfile(): Promise<CacheResult<any>> {
    const startTime = Date.now();
    
    try {
      // Check cache first
      const cached = await this.prisma.gitHubProfileCache.findUnique({
        where: { username: this.username },
      });

      const now = new Date();
      
      if (cached) {
        const age = now.getTime() - cached.lastFetch.getTime();
        const isExpired = now > cached.expiresAt;
        const isStale = age > STALE_WHILE_REVALIDATE.profile;

        // Return cached data if not expired
        if (!isExpired) {
          await this.logAnalytics('profile', 'hit', Date.now() - startTime, age);
          return {
            data: JSON.parse(cached.profileData),
            cached: true,
            stale: false,
            age: Math.floor(age / 1000),
            source: 'cache',
          };
        }

        // Return stale data if available and not too old
        if (!isStale) {
          // Trigger background refresh (fire and forget)
          this.refreshProfileCache().catch(console.error);
          
          await this.logAnalytics('profile', 'stale-hit', Date.now() - startTime, age);
          return {
            data: JSON.parse(cached.profileData),
            cached: true,
            stale: true,
            age: Math.floor(age / 1000),
            source: 'stale-cache',
          };
        }
      }

      // Fetch fresh data from GitHub API
      const result = await this.fetchProfileFromAPI();
      const responseTime = Date.now() - startTime;
      
      if (result.data) {
        await this.logAnalytics('profile', 'miss', responseTime, 0, JSON.stringify(result.data).length);
      } else {
        await this.logAnalytics('profile', 'error', responseTime, 0, 0, result.error);
      }

      return result;
    } catch (error) {
      await this.logAnalytics('profile', 'error', Date.now() - startTime, 0, 0, error instanceof Error ? error.message : 'Unknown error');
      return {
        data: null,
        cached: false,
        stale: false,
        age: 0,
        source: 'api',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Fetch profile data from GitHub API and update cache
   */
  private async fetchProfileFromAPI(): Promise<CacheResult<any>> {
    try {
      const response = await fetch(`${GITHUB_API_BASE}/users/${this.username}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`GitHub API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const profileData = await response.json();
      const dataHash = this.generateDataHash(profileData);
      const now = new Date();
      const expiresAt = new Date(now.getTime() + CACHE_DURATIONS.profile);

      // Update cache
      await this.prisma.gitHubProfileCache.upsert({
        where: { username: this.username },
        update: {
          profileData: JSON.stringify(profileData),
          dataHash,
          expiresAt,
          lastFetch: now,
          fetchCount: { increment: 1 },
          isStale: false,
          errorCount: 0,
          lastError: null,
          rateLimit: JSON.stringify({
            limit: response.headers.get('x-ratelimit-limit'),
            remaining: response.headers.get('x-ratelimit-remaining'),
            reset: response.headers.get('x-ratelimit-reset'),
          }),
        },
        create: {
          username: this.username,
          profileData: JSON.stringify(profileData),
          dataHash,
          expiresAt,
          lastFetch: now,
          fetchCount: 1,
          isStale: false,
          errorCount: 0,
        },
      });

      return {
        data: profileData,
        cached: false,
        stale: false,
        age: 0,
        source: 'api',
        rateLimit: {
          limit: response.headers.get('x-ratelimit-limit'),
          remaining: response.headers.get('x-ratelimit-remaining'),
          reset: response.headers.get('x-ratelimit-reset'),
        },
      };
    } catch (error) {
      // Update error count in cache
      await this.prisma.gitHubProfileCache.updateMany({
        where: { username: this.username },
        data: {
          errorCount: { increment: 1 },
          lastError: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  }

  /**
   * Background refresh of profile cache
   */
  private async refreshProfileCache(): Promise<void> {
    try {
      await this.fetchProfileFromAPI();
    } catch (error) {
      console.error('Background profile refresh failed:', error);
    }
  }

  /**
   * Get GitHub contributions with caching
   */
  async getContributions(year: number): Promise<CacheResult<any>> {
    const startTime = Date.now();
    
    try {
      // Check cache first
      const cached = await this.prisma.gitHubContributionCache.findUnique({
        where: { 
          username_year: {
            username: this.username,
            year: year,
          }
        },
      });

      const now = new Date();
      
      if (cached) {
        const age = now.getTime() - cached.lastFetch.getTime();
        const isExpired = now > cached.expiresAt;
        const isStale = age > STALE_WHILE_REVALIDATE.contributions;

        // Return cached data if not expired
        if (!isExpired) {
          await this.logAnalytics('contributions', 'hit', Date.now() - startTime, age);
          return {
            data: JSON.parse(cached.contributionData),
            cached: true,
            stale: false,
            age: Math.floor(age / 1000),
            source: 'cache',
          };
        }

        // Return stale data if available and not too old
        if (!isStale) {
          // Trigger background refresh (fire and forget)
          this.refreshContributionsCache(year).catch(console.error);
          
          await this.logAnalytics('contributions', 'stale-hit', Date.now() - startTime, age);
          return {
            data: JSON.parse(cached.contributionData),
            cached: true,
            stale: true,
            age: Math.floor(age / 1000),
            source: 'stale-cache',
          };
        }
      }

      // Fetch fresh data from GitHub API
      const result = await this.fetchContributionsFromAPI(year);
      const responseTime = Date.now() - startTime;
      
      if (result.data) {
        await this.logAnalytics('contributions', 'miss', responseTime, 0, JSON.stringify(result.data).length);
      } else {
        await this.logAnalytics('contributions', 'error', responseTime, 0, 0, result.error);
      }

      return result;
    } catch (error) {
      await this.logAnalytics('contributions', 'error', Date.now() - startTime, 0, 0, error instanceof Error ? error.message : 'Unknown error');
      return {
        data: null,
        cached: false,
        stale: false,
        age: 0,
        source: 'api',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Fetch contributions data from GitHub GraphQL API and update cache
   */
  private async fetchContributionsFromAPI(year: number): Promise<CacheResult<any>> {
    try {
      const startDate = `${year}-01-01T00:00:00Z`;
      const endDate = `${year}-12-31T23:59:59Z`;

      const query = `
        query($username: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $username) {
            contributionsCollection(from: $from, to: $to) {
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`GitHub GraphQL API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error(`GraphQL errors: ${result.errors.map((e: any) => e.message).join(', ')}`);
      }

      const contributionCalendar = result.data?.user?.contributionsCollection?.contributionCalendar;

      if (!contributionCalendar) {
        throw new Error('No contribution data found');
      }

      // Transform the data to match our expected format
      const transformedData = {
        totalContributions: contributionCalendar.totalContributions,
        weeks: contributionCalendar.weeks.map((week: any) => ({
          contributionDays: week.contributionDays.map((day: any) => ({
            date: day.date,
            count: day.contributionCount,
            level: day.contributionLevel,
          })),
          firstDay: week.firstDay,
        })),
        months: contributionCalendar.months,
      };

      const dataHash = this.generateDataHash(transformedData);
      const now = new Date();
      const expiresAt = new Date(now.getTime() + CACHE_DURATIONS.contributions);

      // Calculate streaks
      const allContributions = transformedData.weeks.flatMap(week => week.contributionDays);
      const streaks = this.calculateContributionStreaks(allContributions);

      // Update cache
      await this.prisma.gitHubContributionCache.upsert({
        where: {
          username_year: {
            username: this.username,
            year: year,
          }
        },
        update: {
          contributionData: JSON.stringify(transformedData),
          dataHash,
          expiresAt,
          lastFetch: now,
          fetchCount: { increment: 1 },
          isStale: false,
          errorCount: 0,
          lastError: null,
          totalContributions: transformedData.totalContributions,
          currentStreak: streaks.currentStreak,
          longestStreak: streaks.longestStreak,
          rateLimit: JSON.stringify({
            limit: response.headers.get('x-ratelimit-limit'),
            remaining: response.headers.get('x-ratelimit-remaining'),
            reset: response.headers.get('x-ratelimit-reset'),
          }),
        },
        create: {
          username: this.username,
          year: year,
          contributionData: JSON.stringify(transformedData),
          dataHash,
          expiresAt,
          lastFetch: now,
          fetchCount: 1,
          isStale: false,
          errorCount: 0,
          totalContributions: transformedData.totalContributions,
          currentStreak: streaks.currentStreak,
          longestStreak: streaks.longestStreak,
        },
      });

      return {
        data: transformedData,
        cached: false,
        stale: false,
        age: 0,
        source: 'api',
        rateLimit: {
          limit: response.headers.get('x-ratelimit-limit'),
          remaining: response.headers.get('x-ratelimit-remaining'),
          reset: response.headers.get('x-ratelimit-reset'),
        },
      };
    } catch (error) {
      // Update error count in cache
      await this.prisma.gitHubContributionCache.updateMany({
        where: {
          username: this.username,
          year: year,
        },
        data: {
          errorCount: { increment: 1 },
          lastError: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  }

  /**
   * Background refresh of contributions cache
   */
  private async refreshContributionsCache(year: number): Promise<void> {
    try {
      await this.fetchContributionsFromAPI(year);
    } catch (error) {
      console.error('Background contributions refresh failed:', error);
    }
  }

  /**
   * Calculate contribution streaks
   */
  private calculateContributionStreaks(contributions: any[]): { currentStreak: number; longestStreak: number } {
    if (!contributions || contributions.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Sort contributions by date
    const sortedContributions = contributions
      .filter(c => c.count > 0)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate current streak (from today backwards)
    for (let i = sortedContributions.length - 1; i >= 0; i--) {
      const contribDate = new Date(sortedContributions[i].date);
      contribDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((today.getTime() - contribDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === currentStreak) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    for (let i = 0; i < sortedContributions.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = new Date(sortedContributions[i - 1].date);
        const currDate = new Date(sortedContributions[i].date);
        const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  }

  /**
   * Get GitHub repositories with caching
   */
  async getRepositories(page: number = 1, perPage: number = 30): Promise<CacheResult<any>> {
    const startTime = Date.now();

    try {
      // Check cache first
      const cached = await this.prisma.gitHubRepoCache.findUnique({
        where: {
          username_page_perPage: {
            username: this.username,
            page: page,
            perPage: perPage,
          }
        },
      });

      const now = new Date();

      if (cached) {
        const age = now.getTime() - cached.lastFetch.getTime();
        const isExpired = now > cached.expiresAt;
        const isStale = age > STALE_WHILE_REVALIDATE.repos;

        // Return cached data if not expired
        if (!isExpired) {
          await this.logAnalytics('repos', 'hit', Date.now() - startTime, age);
          return {
            data: JSON.parse(cached.reposData),
            cached: true,
            stale: false,
            age: Math.floor(age / 1000),
            source: 'cache',
          };
        }

        // Return stale data if available and not too old
        if (!isStale) {
          // Trigger background refresh (fire and forget)
          this.refreshRepositoriesCache(page, perPage).catch(console.error);

          await this.logAnalytics('repos', 'stale-hit', Date.now() - startTime, age);
          return {
            data: JSON.parse(cached.reposData),
            cached: true,
            stale: true,
            age: Math.floor(age / 1000),
            source: 'stale-cache',
          };
        }
      }

      // Fetch fresh data from GitHub API
      const result = await this.fetchRepositoriesFromAPI(page, perPage);
      const responseTime = Date.now() - startTime;

      if (result.data) {
        await this.logAnalytics('repos', 'miss', responseTime, 0, JSON.stringify(result.data).length);
      } else {
        await this.logAnalytics('repos', 'error', responseTime, 0, 0, result.error);
      }

      return result;
    } catch (error) {
      await this.logAnalytics('repos', 'error', Date.now() - startTime, 0, 0, error instanceof Error ? error.message : 'Unknown error');
      return {
        data: null,
        cached: false,
        stale: false,
        age: 0,
        source: 'api',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Fetch repositories data from GitHub API and update cache
   */
  private async fetchRepositoriesFromAPI(page: number, perPage: number): Promise<CacheResult<any>> {
    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/users/${this.username}/repos?sort=updated&per_page=${perPage}&page=${page}`,
        {
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`GitHub API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const reposData = await response.json();
      const dataHash = this.generateDataHash(reposData);
      const now = new Date();
      const expiresAt = new Date(now.getTime() + CACHE_DURATIONS.repos);

      // Update cache
      await this.prisma.gitHubRepoCache.upsert({
        where: {
          username_page_perPage: {
            username: this.username,
            page: page,
            perPage: perPage,
          }
        },
        update: {
          reposData: JSON.stringify(reposData),
          dataHash,
          expiresAt,
          lastFetch: now,
          fetchCount: { increment: 1 },
          isStale: false,
          errorCount: 0,
          lastError: null,
          totalCount: reposData.length,
          rateLimit: JSON.stringify({
            limit: response.headers.get('x-ratelimit-limit'),
            remaining: response.headers.get('x-ratelimit-remaining'),
            reset: response.headers.get('x-ratelimit-reset'),
          }),
        },
        create: {
          username: this.username,
          page: page,
          perPage: perPage,
          reposData: JSON.stringify(reposData),
          dataHash,
          expiresAt,
          lastFetch: now,
          fetchCount: 1,
          isStale: false,
          errorCount: 0,
          totalCount: reposData.length,
        },
      });

      return {
        data: reposData,
        cached: false,
        stale: false,
        age: 0,
        source: 'api',
        rateLimit: {
          limit: response.headers.get('x-ratelimit-limit'),
          remaining: response.headers.get('x-ratelimit-remaining'),
          reset: response.headers.get('x-ratelimit-reset'),
        },
      };
    } catch (error) {
      // Update error count in cache
      await this.prisma.gitHubRepoCache.updateMany({
        where: {
          username: this.username,
          page: page,
          perPage: perPage,
        },
        data: {
          errorCount: { increment: 1 },
          lastError: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  }

  /**
   * Background refresh of repositories cache
   */
  private async refreshRepositoriesCache(page: number, perPage: number): Promise<void> {
    try {
      await this.fetchRepositoriesFromAPI(page, perPage);
    } catch (error) {
      console.error('Background repositories refresh failed:', error);
    }
  }

  /**
   * Invalidate all cache for a user
   */
  async invalidateCache(): Promise<void> {
    try {
      await Promise.all([
        this.prisma.gitHubProfileCache.deleteMany({
          where: { username: this.username },
        }),
        this.prisma.gitHubRepoCache.deleteMany({
          where: { username: this.username },
        }),
        this.prisma.gitHubContributionCache.deleteMany({
          where: { username: this.username },
        }),
        this.prisma.gitHubStatsCache.deleteMany({
          where: { username: this.username },
        }),
      ]);
    } catch (error) {
      console.error('Failed to invalidate cache:', error);
      throw error;
    }
  }
}

/**
 * Main Edge Function Handler
 */
export default async function handler(request: Request, context: Context) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Get environment variables
    const githubToken = Deno.env.get('GITHUB_TOKEN');
    const githubUsername = Deno.env.get('GITHUB_USERNAME') || 'GreenHacker420';
    const databaseUrl = Deno.env.get('DATABASE_URL');

    if (!githubToken) {
      return new Response(
        JSON.stringify({
          error: 'GitHub token not configured',
          success: false
        }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          },
        }
      );
    }

    if (!databaseUrl) {
      return new Response(
        JSON.stringify({
          error: 'Database not configured',
          success: false
        }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          },
        }
      );
    }

    // Initialize Prisma client
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });

    // Initialize GitHub cache service
    const cacheService = new GitHubCacheService(prisma, githubUsername, githubToken);

    let result;
    const searchParams = url.searchParams;

    // Route handling
    if (pathname.endsWith('/profile')) {
      result = await cacheService.getProfile();
    } else if (pathname.endsWith('/repos')) {
      const page = parseInt(searchParams.get('page') || '1');
      const perPage = Math.min(parseInt(searchParams.get('per_page') || '30'), 100);
      result = await cacheService.getRepositories(page, perPage);
    } else if (pathname.endsWith('/contributions')) {
      const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
      result = await cacheService.getContributions(year);
    } else if (pathname.endsWith('/invalidate')) {
      if (request.method !== 'POST') {
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          {
            status: 405,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            },
          }
        );
      }

      await cacheService.invalidateCache();
      result = { success: true, message: 'Cache invalidated' };
    } else {
      return new Response(
        JSON.stringify({ error: 'Endpoint not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          },
        }
      );
    }

    // Close Prisma connection
    await prisma.$disconnect();

    // Return successful response
    return new Response(
      JSON.stringify({
        success: true,
        ...result,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': result.cached ?
            `public, max-age=${Math.max(0, Math.floor((result.age || 0) / 1000))}` :
            'no-cache',
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('Edge function error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}

// Edge function configuration
export const config = {
  path: [
    '/api/edge/github/profile',
    '/api/edge/github/repos',
    '/api/edge/github/contributions',
    '/api/edge/github/invalidate',
  ],
};
