/**
 * GitHub Synchronization Service
 * Implements incremental data synchronization with intelligent caching
 */

import { GitHubContributionCalendar, GITHUB_API_ENDPOINTS } from '@/types/github';
import { contributionCache, CacheEntry, CACHE_CONFIG } from './contributionCacheService';
import { retryStrategy, withRateLimitRetry } from './retryStrategy';
import { getGitHubService } from './githubService';

/**
 * Sync operation result
 */
export interface SyncResult {
  success: boolean;
  data?: GitHubContributionCalendar;
  source: 'api' | 'cache' | 'merged';
  isFresh: boolean;
  error?: string;
  retryAfter?: number;
  cacheStatus: 'hit' | 'miss' | 'stale' | 'invalid';
}

/**
 * Sync options
 */
export interface SyncOptions {
  forceRefresh?: boolean;
  allowStaleData?: boolean;
  maxRetries?: number;
  timeoutMs?: number;
}

/**
 * GitHub Synchronization Service
 */
export class GitHubSyncService {
  private activeSyncs = new Map<number, Promise<SyncResult>>();
  private lastSyncTimes = new Map<number, number>();

  /**
   * Synchronize contribution data for a specific year
   */
  async syncContributions(year: number, options: SyncOptions = {}): Promise<SyncResult> {
    const syncKey = year;
    
    // Return existing sync operation if in progress
    if (this.activeSyncs.has(syncKey)) {
      return this.activeSyncs.get(syncKey)!;
    }

    // Create new sync operation
    const syncPromise = this.performSync(year, options);
    this.activeSyncs.set(syncKey, syncPromise);

    try {
      const result = await syncPromise;
      this.lastSyncTimes.set(year, Date.now());
      return result;
    } finally {
      this.activeSyncs.delete(syncKey);
    }
  }

  /**
   * Perform the actual synchronization
   */
  private async performSync(year: number, options: SyncOptions): Promise<SyncResult> {
    try {
      // Step 1: Check cache first
      const cacheResult = await this.checkCache(year, options);
      if (cacheResult.shouldUseCache) {
        return cacheResult.result;
      }

      // Step 2: Attempt API fetch with retry logic
      const apiResult = await this.fetchFromAPI(year, options);
      if (apiResult.success) {
        // Step 3: Merge with existing cache data
        const mergedData = await contributionCache.mergeContributionData(year, apiResult.data!);
        
        return {
          success: true,
          data: mergedData,
          source: cacheResult.existingEntry ? 'merged' : 'api',
          isFresh: true,
          cacheStatus: cacheResult.existingEntry ? 'hit' : 'miss',
        };
      }

      // Step 4: Fallback to cache if API fails
      if (cacheResult.existingEntry) {
        return {
          success: true,
          data: cacheResult.existingEntry.data,
          source: 'cache',
          isFresh: contributionCache.isCacheFresh(cacheResult.existingEntry),
          error: apiResult.error,
          retryAfter: apiResult.retryAfter,
          cacheStatus: contributionCache.isCacheFresh(cacheResult.existingEntry) ? 'hit' : 'stale',
        };
      }

      // Step 5: No cache available, return error
      return {
        success: false,
        source: 'api',
        isFresh: false,
        error: apiResult.error || 'No data available',
        retryAfter: apiResult.retryAfter,
        cacheStatus: 'miss',
      };

    } catch (error) {
      console.error(`Sync error for year ${year}:`, error);
      
      // Try to return cached data as last resort
      const fallbackEntry = await contributionCache.getCacheEntry(year);
      if (fallbackEntry) {
        return {
          success: true,
          data: fallbackEntry.data,
          source: 'cache',
          isFresh: false,
          error: 'Sync failed, using cached data',
          cacheStatus: 'stale',
        };
      }

      return {
        success: false,
        source: 'api',
        isFresh: false,
        error: error instanceof Error ? error.message : 'Unknown sync error',
        cacheStatus: 'miss',
      };
    }
  }

  /**
   * Check cache and determine if we should use cached data
   */
  private async checkCache(year: number, options: SyncOptions): Promise<{
    shouldUseCache: boolean;
    result: SyncResult;
    existingEntry?: CacheEntry;
  }> {
    const existingEntry = await contributionCache.getCacheEntry(year);
    
    if (!existingEntry) {
      return {
        shouldUseCache: false,
        result: { success: false, source: 'cache', isFresh: false, cacheStatus: 'miss' },
      };
    }

    // Check if we should force refresh
    if (options.forceRefresh) {
      return {
        shouldUseCache: false,
        result: { success: false, source: 'cache', isFresh: false, cacheStatus: 'hit' },
        existingEntry,
      };
    }

    // Use fresh cache data
    if (contributionCache.isCacheFresh(existingEntry)) {
      return {
        shouldUseCache: true,
        result: {
          success: true,
          data: existingEntry.data,
          source: 'cache',
          isFresh: true,
          cacheStatus: 'hit',
        },
        existingEntry,
      };
    }

    // Use stale cache data if allowed
    if (options.allowStaleData && !contributionCache.isCacheStale(existingEntry)) {
      return {
        shouldUseCache: true,
        result: {
          success: true,
          data: existingEntry.data,
          source: 'cache',
          isFresh: false,
          cacheStatus: 'stale',
        },
        existingEntry,
      };
    }

    // Cache exists but needs refresh
    return {
      shouldUseCache: false,
      result: { success: false, source: 'cache', isFresh: false, cacheStatus: 'stale' },
      existingEntry,
    };
  }

  /**
   * Fetch data from GitHub API with retry logic
   */
  private async fetchFromAPI(year: number, options: SyncOptions): Promise<{
    success: boolean;
    data?: GitHubContributionCalendar;
    error?: string;
    retryAfter?: number;
  }> {
    const operationId = `github-contributions-${year}`;

    try {
      // Try GitHub service first
      const githubService = getGitHubService();
      const serviceResult = await withRateLimitRetry(
        () => githubService.fetchContributions(year),
        operationId
      );

      if (serviceResult.success && serviceResult.data) {
        return {
          success: true,
          data: serviceResult.data,
        };
      }

      // Fallback to direct API call
      const apiResult = await withRateLimitRetry(
        () => this.directAPICall(year),
        `${operationId}-direct`
      );

      return {
        success: true,
        data: apiResult,
      };

    } catch (error: any) {
      console.error(`API fetch failed for year ${year}:`, error);

      // Handle rate limiting specifically
      if (error.status === 429 || error.message?.includes('rate limit')) {
        const retryAfter = retryStrategy.getNextRetryTime(error);
        return {
          success: false,
          error: 'GitHub API rate limit exceeded',
          retryAfter: retryAfter ? Math.ceil((retryAfter - Date.now()) / 1000) : undefined,
        };
      }

      return {
        success: false,
        error: error.message || 'API fetch failed',
      };
    }
  }

  /**
   * Direct API call to GitHub contributions endpoint
   */
  private async directAPICall(year: number): Promise<GitHubContributionCalendar> {
    const response = await fetch(
      `${GITHUB_API_ENDPOINTS.CONTRIBUTIONS}?year=${year}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'GitHub-Portfolio-App/1.0',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      }
    );

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`) as any;
      error.status = response.status;
      error.headers = Object.fromEntries(response.headers.entries());
      throw error;
    }

    const data = await response.json();
    
    if (!data.success || !data.contributions) {
      throw new Error('Invalid API response format');
    }

    return data.contributions;
  }

  /**
   * Sync multiple years efficiently
   */
  async syncMultipleYears(years: number[], options: SyncOptions = {}): Promise<Map<number, SyncResult>> {
    const results = new Map<number, SyncResult>();
    
    // Process years in parallel with concurrency limit
    const concurrencyLimit = 3;
    const chunks = this.chunkArray(years, concurrencyLimit);
    
    for (const chunk of chunks) {
      const chunkPromises = chunk.map(year => 
        this.syncContributions(year, options).then(result => ({ year, result }))
      );
      
      const chunkResults = await Promise.all(chunkPromises);
      chunkResults.forEach(({ year, result }) => {
        results.set(year, result);
      });
    }
    
    return results;
  }

  /**
   * Get cache status for multiple years
   */
  async getCacheStatus(): Promise<Map<number, { isFresh: boolean; lastUpdated: number; size: number }>> {
    const cachedYears = await contributionCache.getAllCachedYears();
    const status = new Map();
    
    for (const year of cachedYears) {
      const entry = await contributionCache.getCacheEntry(year);
      if (entry) {
        status.set(year, {
          isFresh: contributionCache.isCacheFresh(entry),
          lastUpdated: entry.lastUpdated,
          size: JSON.stringify(entry.data).length,
        });
      }
    }
    
    return status;
  }

  /**
   * Clear cache for specific years
   */
  async clearCache(years?: number[]): Promise<void> {
    if (years) {
      await Promise.all(years.map(year => contributionCache.clearCacheEntry(year)));
    } else {
      await contributionCache.clearAllCache();
    }
  }

  /**
   * Utility function to chunk array
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

// Singleton instance
export const githubSyncService = new GitHubSyncService();
