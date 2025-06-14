/**
 * Cache Management Component
 * Provides user interface for managing GitHub contribution cache
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  RefreshCw, 
  Trash2, 
  Database, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  HardDrive,
  Calendar
} from 'lucide-react';
import { formatNumber } from '@/utils/githubCalculations';

/**
 * Cache status information
 */
interface CacheStatus {
  year: number;
  isFresh: boolean;
  lastUpdated: number;
  size: number;
  totalContributions?: number;
}

/**
 * Cache Manager Component
 */
export function CacheManager() {
  const [cacheStatus, setCacheStatus] = useState<CacheStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState<Set<number>>(new Set());
  const [isClearing, setIsClearing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  /**
   * Load cache status information
   * Note: Simplified version for client-side use
   */
  const loadCacheStatus = async () => {
    try {
      setIsLoading(true);

      // For now, show a message that cache management requires server-side access
      setCacheStatus([]);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to load cache status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh cache for a specific year
   */
  const refreshYear = async (year: number) => {
    try {
      setIsRefreshing(prev => new Set(prev).add(year));

      // Use API call to refresh data
      const response = await fetch(`/api/github/contributions?year=${year}&refresh=true`);
      if (!response.ok) {
        throw new Error('Failed to refresh data');
      }

      await loadCacheStatus();
    } catch (error) {
      console.error(`Failed to refresh cache for year ${year}:`, error);
    } finally {
      setIsRefreshing(prev => {
        const newSet = new Set(prev);
        newSet.delete(year);
        return newSet;
      });
    }
  };

  /**
   * Clear cache for a specific year
   */
  const clearYear = async (year: number) => {
    try {
      // Note: Cache clearing would require a server-side API endpoint
      console.log(`Clear cache for year ${year} - requires server-side implementation`);
      await loadCacheStatus();
    } catch (error) {
      console.error(`Failed to clear cache for year ${year}:`, error);
    }
  };

  /**
   * Clear all cache
   */
  const clearAllCache = async () => {
    try {
      setIsClearing(true);
      // Note: Cache clearing would require a server-side API endpoint
      console.log('Clear all cache - requires server-side implementation');
      await loadCacheStatus();
    } catch (error) {
      console.error('Failed to clear all cache:', error);
    } finally {
      setIsClearing(false);
    }
  };

  /**
   * Format file size
   */
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  /**
   * Format time ago
   */
  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  /**
   * Calculate total cache size
   */
  const totalCacheSize = cacheStatus.reduce((sum, status) => sum + status.size, 0);

  /**
   * Load cache status on mount
   */
  useEffect(() => {
    loadCacheStatus();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-github-dark p-6 rounded-xl border border-github-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Database className="text-neon-green" size={24} />
          <div>
            <h3 className="text-xl font-bold text-white">Cache Management</h3>
            <p className="text-github-text text-sm">
              Manage GitHub contribution data cache
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={loadCacheStatus}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
          
          <button
            onClick={clearAllCache}
            disabled={isClearing || cacheStatus.length === 0}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 size={16} />
            Clear All
          </button>
        </div>
      </div>

      {/* Cache Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-github-border/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive size={16} className="text-blue-400" />
            <span className="text-sm text-github-text">Total Size</span>
          </div>
          <div className="text-xl font-bold text-white">
            {formatSize(totalCacheSize)}
          </div>
        </div>
        
        <div className="bg-github-border/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-green-400" />
            <span className="text-sm text-github-text">Cached Years</span>
          </div>
          <div className="text-xl font-bold text-white">
            {cacheStatus.length}
          </div>
        </div>
        
        <div className="bg-github-border/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-yellow-400" />
            <span className="text-sm text-github-text">Last Updated</span>
          </div>
          <div className="text-xl font-bold text-white">
            {lastRefresh ? formatTimeAgo(lastRefresh.getTime()) : 'Never'}
          </div>
        </div>
      </div>

      {/* Cache Entries */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw size={24} className="animate-spin text-github-text" />
        </div>
      ) : cacheStatus.length === 0 ? (
        <div className="text-center py-8 text-github-text">
          <Database size={48} className="mx-auto mb-4 opacity-50" />
          <p>No cached data found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cacheStatus.map((status) => (
            <motion.div
              key={status.year}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-4 bg-github-border/10 rounded-lg border border-github-border/30"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {status.isFresh ? (
                    <CheckCircle size={16} className="text-green-400" />
                  ) : (
                    <AlertCircle size={16} className="text-yellow-400" />
                  )}
                  <span className="font-semibold text-white">{status.year}</span>
                </div>
                
                <div className="text-sm text-github-text">
                  {status.totalContributions !== undefined && (
                    <span className="mr-4">
                      {formatNumber(status.totalContributions)} contributions
                    </span>
                  )}
                  <span className="mr-4">{formatSize(status.size)}</span>
                  <span>{formatTimeAgo(status.lastUpdated)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => refreshYear(status.year)}
                  disabled={isRefreshing.has(status.year)}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50"
                >
                  <RefreshCw 
                    size={12} 
                    className={isRefreshing.has(status.year) ? 'animate-spin' : ''} 
                  />
                  Refresh
                </button>
                
                <button
                  onClick={() => clearYear(status.year)}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                >
                  <Trash2 size={12} />
                  Clear
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
