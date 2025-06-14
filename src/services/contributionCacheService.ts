/**
 * Persistent Cache Service for GitHub Contributions
 * Implements incremental data synchronization with IndexedDB storage
 */

import { GitHubContributionCalendar, GitHubContribution } from '@/types/github';

/**
 * Cache entry structure for persistent storage
 */
export interface CacheEntry {
  year: number;
  data: GitHubContributionCalendar;
  timestamp: number;
  lastUpdated: number;
  version: string;
  checksum: string;
  isComplete: boolean;
  retryCount: number;
  nextRetryAt?: number;
}

/**
 * Cache configuration and constants
 */
export const CACHE_CONFIG = {
  DB_NAME: 'github_contributions_cache',
  DB_VERSION: 1,
  STORE_NAME: 'contributions',
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  STALE_THRESHOLD: 7 * 24 * 60 * 60 * 1000, // 7 days
  MAX_RETRY_COUNT: 3,
  RETRY_DELAYS: [1000, 5000, 15000], // Exponential backoff
  CURRENT_VERSION: '1.0.0',
};

/**
 * Persistent Cache Service using IndexedDB
 */
export class ContributionCacheService {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  /**
   * Initialize IndexedDB connection
   */
  private async initDB(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(CACHE_CONFIG.DB_NAME, CACHE_CONFIG.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(CACHE_CONFIG.STORE_NAME)) {
          const store = db.createObjectStore(CACHE_CONFIG.STORE_NAME, { keyPath: 'year' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('lastUpdated', 'lastUpdated', { unique: false });
        }
      };
    });
  }

  /**
   * Ensure database is initialized
   */
  private async ensureDB(): Promise<void> {
    if (!this.initPromise) {
      this.initPromise = this.initDB();
    }
    await this.initPromise;
  }

  /**
   * Generate checksum for data integrity validation
   */
  private generateChecksum(data: GitHubContributionCalendar): string {
    const dataString = JSON.stringify({
      totalContributions: data.totalContributions,
      weekCount: data.weeks.length,
      firstWeek: data.weeks[0]?.firstDay,
      lastWeek: data.weeks[data.weeks.length - 1]?.firstDay,
    });
    
    // Simple hash function for checksum
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  /**
   * Store contribution data in cache
   */
  async setCacheEntry(year: number, data: GitHubContributionCalendar): Promise<void> {
    await this.ensureDB();
    if (!this.db) throw new Error('Database not initialized');

    const now = Date.now();
    const entry: CacheEntry = {
      year,
      data,
      timestamp: now,
      lastUpdated: now,
      version: CACHE_CONFIG.CURRENT_VERSION,
      checksum: this.generateChecksum(data),
      isComplete: this.validateDataCompleteness(data, year),
      retryCount: 0,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CACHE_CONFIG.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(CACHE_CONFIG.STORE_NAME);
      const request = store.put(entry);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Retrieve contribution data from cache
   */
  async getCacheEntry(year: number): Promise<CacheEntry | null> {
    await this.ensureDB();
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CACHE_CONFIG.STORE_NAME], 'readonly');
      const store = transaction.objectStore(CACHE_CONFIG.STORE_NAME);
      const request = store.get(year);

      request.onsuccess = () => {
        const entry = request.result as CacheEntry | undefined;
        if (entry && this.validateCacheEntry(entry)) {
          resolve(entry);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Merge new contribution data with existing cached data
   */
  async mergeContributionData(
    year: number, 
    newData: GitHubContributionCalendar
  ): Promise<GitHubContributionCalendar> {
    const existingEntry = await this.getCacheEntry(year);
    
    if (!existingEntry) {
      // No existing data, store new data as-is
      await this.setCacheEntry(year, newData);
      return newData;
    }

    const existingData = existingEntry.data;
    const mergedData = this.performDataMerge(existingData, newData);
    
    // Update cache with merged data
    await this.setCacheEntry(year, mergedData);
    
    return mergedData;
  }

  /**
   * Perform intelligent data merging
   */
  private performDataMerge(
    existing: GitHubContributionCalendar,
    incoming: GitHubContributionCalendar
  ): GitHubContributionCalendar {
    // Create a map of existing contributions by date for fast lookup
    const existingContributions = new Map<string, GitHubContribution>();
    
    existing.weeks.forEach(week => {
      week.contributionDays.forEach(day => {
        existingContributions.set(day.date, day);
      });
    });

    // Merge contribution data
    const mergedWeeks = incoming.weeks.map(incomingWeek => ({
      ...incomingWeek,
      contributionDays: incomingWeek.contributionDays.map(incomingDay => {
        const existingDay = existingContributions.get(incomingDay.date);
        
        if (!existingDay) {
          // New contribution day
          return incomingDay;
        }

        // Merge existing and incoming data (prefer incoming if different)
        return {
          date: incomingDay.date,
          count: incomingDay.count !== undefined ? incomingDay.count : existingDay.count,
          level: incomingDay.level !== undefined ? incomingDay.level : existingDay.level,
        };
      }),
    }));

    // Recalculate total contributions
    const totalContributions = mergedWeeks
      .flatMap(week => week.contributionDays)
      .reduce((sum, day) => sum + (day.count || 0), 0);

    return {
      totalContributions,
      weeks: mergedWeeks,
      months: incoming.months || existing.months,
    };
  }

  /**
   * Validate cache entry integrity
   */
  private validateCacheEntry(entry: CacheEntry): boolean {
    // Check version compatibility
    if (entry.version !== CACHE_CONFIG.CURRENT_VERSION) {
      return false;
    }

    // Validate checksum
    const currentChecksum = this.generateChecksum(entry.data);
    if (currentChecksum !== entry.checksum) {
      console.warn(`Cache entry checksum mismatch for year ${entry.year}`);
      return false;
    }

    // Check if data structure is valid
    if (!entry.data || !entry.data.weeks || !Array.isArray(entry.data.weeks)) {
      return false;
    }

    return true;
  }

  /**
   * Validate data completeness for a given year
   */
  private validateDataCompleteness(data: GitHubContributionCalendar, year: number): boolean {
    const expectedDays = this.isLeapYear(year) ? 366 : 365;
    const actualDays = data.weeks.flatMap(week => week.contributionDays).length;
    
    // Allow some tolerance for partial year data
    return actualDays >= Math.floor(expectedDays * 0.95);
  }

  /**
   * Check if a year is a leap year
   */
  private isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  /**
   * Check if cached data is fresh
   */
  isCacheFresh(entry: CacheEntry): boolean {
    const now = Date.now();
    return (now - entry.lastUpdated) < CACHE_CONFIG.CACHE_DURATION;
  }

  /**
   * Check if cached data is stale and should be refreshed
   */
  isCacheStale(entry: CacheEntry): boolean {
    const now = Date.now();
    return (now - entry.lastUpdated) > CACHE_CONFIG.STALE_THRESHOLD;
  }

  /**
   * Get all cached years
   */
  async getAllCachedYears(): Promise<number[]> {
    await this.ensureDB();
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CACHE_CONFIG.STORE_NAME], 'readonly');
      const store = transaction.objectStore(CACHE_CONFIG.STORE_NAME);
      const request = store.getAllKeys();

      request.onsuccess = () => resolve(request.result as number[]);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear cache for a specific year
   */
  async clearCacheEntry(year: number): Promise<void> {
    await this.ensureDB();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CACHE_CONFIG.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(CACHE_CONFIG.STORE_NAME);
      const request = store.delete(year);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all cache entries
   */
  async clearAllCache(): Promise<void> {
    await this.ensureDB();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CACHE_CONFIG.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(CACHE_CONFIG.STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Singleton instance
export const contributionCache = new ContributionCacheService();
