/**
 * GitHub Cache Service for Next.js API Routes
 * Provides caching layer with Neon PostgreSQL integration
 */

import { PrismaClient } from '@prisma/client';
import { GitHubProfile, GitHubContributionCalendar } from '@/types/github';

// Type-safe Prisma client wrapper to handle missing models gracefully
interface SafePrismaClient extends PrismaClient {
  gitHubCacheAnalytics?: any;
  gitHubProfileCache?: any;
  gitHubRepoCache?: any;
  gitHubContributionCache?: any;
  gitHubStatsCache?: any;
}

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

// Types for cache operations
interface CacheResult<T> {
  data: T | null;
  cached: boolean;
  stale: boolean;
  age: number;
  source: 'cache' | 'api' | 'stale-cache' | 'edge';
  error?: string;
  rateLimit?: any;
}

interface CacheOptions {
  forceRefresh?: boolean;
  useEdgeCache?: boolean;
  fallbackToAPI?: boolean;
}

/**
 * GitHub Cache Service for API Routes
 */
export class GitHubCacheService {
  private prisma: SafePrismaClient;
  private username: string;
  private token: string;
  private edgeBaseUrl: string;
  private cacheEnabled: boolean;

  constructor(prisma: PrismaClient, username: string, token: string, edgeBaseUrl?: string) {
    this.prisma = prisma as SafePrismaClient;
    this.username = username;
    this.token = token;
    this.edgeBaseUrl = edgeBaseUrl || '';

    // Check if cache models are available
    this.cacheEnabled = this.checkCacheModelsAvailable();

    if (!this.cacheEnabled) {
      console.warn('GitHub cache models not available. Cache operations will be disabled.');
    }
  }

  /**
   * Check if cache models are available in Prisma client
   */
  private checkCacheModelsAvailable(): boolean {
    try {
      return !!(
        this.prisma.gitHubCacheAnalytics &&
        this.prisma.gitHubProfileCache &&
        this.prisma.gitHubRepoCache &&
        this.prisma.gitHubContributionCache &&
        this.prisma.gitHubStatsCache
      );
    } catch {
      return false;
    }
  }

  /**
   * Generate data hash for change detection
   */
  private generateDataHash(data: any): string {
    const jsonString = JSON.stringify(data, Object.keys(data).sort());
    return Buffer.from(jsonString).toString('base64').slice(0, 32);
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
    if (!this.cacheEnabled || !this.prisma.gitHubCacheAnalytics) {
      // Fallback to console logging if cache is not available
      console.log(`GitHub Cache Analytics: ${cacheType}/${operation}`, {
        username: this.username,
        responseTime,
        cacheAge,
        dataSize,
        errorMessage,
        metadata,
      });
      return;
    }

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
   * Try to get data from edge cache first, fallback to local cache/API
   */
  private async tryEdgeCache(endpoint: string, params?: URLSearchParams): Promise<CacheResult<any> | null> {
    if (!this.edgeBaseUrl) return null;

    try {
      const url = new URL(`${this.edgeBaseUrl}/api/edge/github/${endpoint}`);
      if (params) {
        params.forEach((value, key) => url.searchParams.set(key, value));
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'User-Agent': 'Portfolio-Cache-Service/1.0',
        },
        // Short timeout for edge cache
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          return {
            data: result.data,
            cached: result.cached || false,
            stale: result.stale || false,
            age: result.age || 0,
            source: 'edge',
            rateLimit: result.rateLimit,
          };
        }
      }
    } catch (error) {
      console.warn('Edge cache failed, falling back to local cache:', error);
    }

    return null;
  }

  /**
   * Get GitHub profile with intelligent caching
   */
  async getProfile(options: CacheOptions = {}): Promise<CacheResult<GitHubProfile>> {
    const startTime = Date.now();

    try {
      // Try edge cache first if enabled
      if (options.useEdgeCache && !options.forceRefresh) {
        const edgeResult = await this.tryEdgeCache('profile');
        if (edgeResult) {
          await this.logAnalytics('profile', 'edge-hit', Date.now() - startTime, edgeResult.age);
          return edgeResult;
        }
      }

      // Check local cache (only if cache is enabled)
      if (!options.forceRefresh && this.cacheEnabled && this.prisma.gitHubProfileCache) {
        try {
          const cached = await this.prisma.gitHubProfileCache.findUnique({
            where: { username: this.username },
          });

          if (cached) {
            const now = new Date();
            const age = now.getTime() - cached.lastFetch.getTime();
            const isExpired = now > cached.expiresAt;
            const isStale = age > STALE_WHILE_REVALIDATE.profile;

            // Return cached data if not expired
            if (!isExpired) {
              await this.logAnalytics('profile', 'hit', Date.now() - startTime, age);
              return {
                data: JSON.parse(cached.profileData) as GitHubProfile,
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
                data: JSON.parse(cached.profileData) as GitHubProfile,
                cached: true,
                stale: true,
                age: Math.floor(age / 1000),
                source: 'stale-cache',
              };
            }
          }
        } catch (error) {
          console.warn('Failed to check profile cache:', error);
          // Continue to API fallback
        }
      }

      // Fetch fresh data from GitHub API if fallback is enabled
      if (options.fallbackToAPI !== false) {
        const result = await this.fetchProfileFromAPI();
        const responseTime = Date.now() - startTime;
        
        if (result.data) {
          await this.logAnalytics('profile', 'miss', responseTime, 0, JSON.stringify(result.data).length);
        } else {
          await this.logAnalytics('profile', 'error', responseTime, 0, 0, result.error);
        }

        return result;
      }

      // No data available
      return {
        data: null,
        cached: false,
        stale: false,
        age: 0,
        source: 'api',
        error: 'No cached data available and API fallback disabled',
      };

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
  private async fetchProfileFromAPI(): Promise<CacheResult<GitHubProfile>> {
    try {
      const response = await fetch(`https://api.github.com/users/${this.username}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-Cache-Service/1.0',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`GitHub API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const profileData = await response.json();
      const dataHash = this.generateDataHash(profileData);
      const now = new Date();
      const expiresAt = new Date(now.getTime() + CACHE_DURATIONS.profile);

      // Update cache (only if cache is enabled)
      if (this.cacheEnabled && this.prisma.gitHubProfileCache) {
        try {
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
        } catch (error) {
          console.warn('Failed to update profile cache:', error);
          // Continue without caching
        }
      }

      return {
        data: profileData as GitHubProfile,
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
      // Update error count in cache (only if cache is enabled)
      if (this.cacheEnabled && this.prisma.gitHubProfileCache) {
        try {
          await this.prisma.gitHubProfileCache.updateMany({
            where: { username: this.username },
            data: {
              errorCount: { increment: 1 },
              lastError: error instanceof Error ? error.message : 'Unknown error',
            },
          });
        } catch (cacheError) {
          console.warn('Failed to update error count in cache:', cacheError);
        }
      }

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
   * Get GitHub contributions with intelligent caching
   */
  async getContributions(year: number, options: CacheOptions = {}): Promise<CacheResult<GitHubContributionCalendar>> {
    const startTime = Date.now();

    try {
      // Try edge cache first if enabled
      if (options.useEdgeCache && !options.forceRefresh) {
        const params = new URLSearchParams({ year: year.toString() });
        const edgeResult = await this.tryEdgeCache('contributions', params);
        if (edgeResult) {
          await this.logAnalytics('contributions', 'edge-hit', Date.now() - startTime, edgeResult.age);
          return edgeResult;
        }
      }

      // Check local cache (only if cache is enabled)
      if (!options.forceRefresh && this.cacheEnabled && this.prisma.gitHubContributionCache) {
        try {
          const cached = await this.prisma.gitHubContributionCache.findUnique({
            where: {
              username_year: {
                username: this.username,
                year: year,
              }
            },
          });

          if (cached) {
            const now = new Date();
            const age = now.getTime() - cached.lastFetch.getTime();
            const isExpired = now > cached.expiresAt;
            const isStale = age > STALE_WHILE_REVALIDATE.contributions;

            // Return cached data if not expired
            if (!isExpired) {
              await this.logAnalytics('contributions', 'hit', Date.now() - startTime, age);
              return {
                data: JSON.parse(cached.contributionData) as GitHubContributionCalendar,
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
                data: JSON.parse(cached.contributionData) as GitHubContributionCalendar,
                cached: true,
                stale: true,
                age: Math.floor(age / 1000),
                source: 'stale-cache',
              };
            }
          }
        } catch (error) {
          console.warn('Failed to check contributions cache:', error);
          // Continue to API fallback
        }
      }

      // Return no data if API fallback is disabled
      if (options.fallbackToAPI === false) {
        return {
          data: null,
          cached: false,
          stale: false,
          age: 0,
          source: 'api',
          error: 'No cached data available and API fallback disabled',
        };
      }

      // For contributions, we'll delegate to the existing GitHub service
      // since it has complex GraphQL logic
      return {
        data: null,
        cached: false,
        stale: false,
        age: 0,
        source: 'api',
        error: 'Direct API fetch not implemented - use existing GitHub service',
      };

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
   * Background refresh of contributions cache
   */
  private async refreshContributionsCache(year: number): Promise<void> {
    try {
      // This would need to be implemented with the GraphQL logic
      console.log(`Background refresh for contributions ${year} not implemented`);
    } catch (error) {
      console.error('Background contributions refresh failed:', error);
    }
  }

  /**
   * Invalidate all cache for a user
   */
  async invalidateCache(): Promise<void> {
    if (!this.cacheEnabled) {
      console.warn('Cache not enabled, skipping invalidation');
      return;
    }

    try {
      const deletePromises = [];

      if (this.prisma.gitHubProfileCache) {
        deletePromises.push(
          this.prisma.gitHubProfileCache.deleteMany({
            where: { username: this.username },
          })
        );
      }

      if (this.prisma.gitHubRepoCache) {
        deletePromises.push(
          this.prisma.gitHubRepoCache.deleteMany({
            where: { username: this.username },
          })
        );
      }

      if (this.prisma.gitHubContributionCache) {
        deletePromises.push(
          this.prisma.gitHubContributionCache.deleteMany({
            where: { username: this.username },
          })
        );
      }

      if (this.prisma.gitHubStatsCache) {
        deletePromises.push(
          this.prisma.gitHubStatsCache.deleteMany({
            where: { username: this.username },
          })
        );
      }

      await Promise.all(deletePromises);
      await this.logAnalytics('all', 'invalidate', 0, 0, 0);
    } catch (error) {
      console.error('Failed to invalidate cache:', error);
      throw error;
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<any> {
    if (!this.cacheEnabled) {
      // Return empty stats if cache is not enabled
      return {
        profile: [],
        repositories: [],
        contributions: [],
        stats: [],
        summary: {
          totalCacheEntries: 0,
          totalFetches: 0,
          totalErrors: 0,
        },
      };
    }

    try {
      const promises = [];

      // Only query models that exist
      if (this.prisma.gitHubProfileCache) {
        promises.push(
          this.prisma.gitHubProfileCache.findMany({
            where: { username: this.username },
            select: {
              lastFetch: true,
              expiresAt: true,
              fetchCount: true,
              errorCount: true,
              isStale: true,
            },
          })
        );
      } else {
        promises.push(Promise.resolve([]));
      }

      if (this.prisma.gitHubRepoCache) {
        promises.push(
          this.prisma.gitHubRepoCache.findMany({
            where: { username: this.username },
            select: {
              lastFetch: true,
              expiresAt: true,
              fetchCount: true,
              errorCount: true,
              isStale: true,
              page: true,
              perPage: true,
            },
          })
        );
      } else {
        promises.push(Promise.resolve([]));
      }

      if (this.prisma.gitHubContributionCache) {
        promises.push(
          this.prisma.gitHubContributionCache.findMany({
            where: { username: this.username },
            select: {
              lastFetch: true,
              expiresAt: true,
              fetchCount: true,
              errorCount: true,
              isStale: true,
              year: true,
            },
          })
        );
      } else {
        promises.push(Promise.resolve([]));
      }

      if (this.prisma.gitHubStatsCache) {
        promises.push(
          this.prisma.gitHubStatsCache.findMany({
            where: { username: this.username },
            select: {
              lastFetch: true,
              expiresAt: true,
              fetchCount: true,
              errorCount: true,
              isStale: true,
            },
          })
        );
      } else {
        promises.push(Promise.resolve([]));
      }

      const [profileCache, repoCache, contributionCache, statsCache] = await Promise.all(promises);

      return {
        profile: profileCache,
        repositories: repoCache,
        contributions: contributionCache,
        stats: statsCache,
        summary: {
          totalCacheEntries: profileCache.length + repoCache.length + contributionCache.length + statsCache.length,
          totalFetches: [
            ...profileCache,
            ...repoCache,
            ...contributionCache,
            ...statsCache,
          ].reduce((sum, cache) => sum + cache.fetchCount, 0),
          totalErrors: [
            ...profileCache,
            ...repoCache,
            ...contributionCache,
            ...statsCache,
          ].reduce((sum, cache) => sum + cache.errorCount, 0),
        },
      };
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      throw error;
    }
  }
}

/**
 * Create a GitHub cache service instance
 */
export function createGitHubCacheService(
  prisma: PrismaClient,
  username?: string,
  token?: string,
  edgeBaseUrl?: string
): GitHubCacheService {
  const githubUsername = username || process.env.GITHUB_USERNAME || 'GreenHacker420';
  const githubToken = token || process.env.GITHUB_TOKEN || '';
  const netlifyUrl = edgeBaseUrl || process.env.NETLIFY_URL || '';

  return new GitHubCacheService(prisma, githubUsername, githubToken, netlifyUrl);
}
