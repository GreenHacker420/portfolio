/**
 * GitHub Cache Monitor Component
 * Provides real-time monitoring and management of the GitHub cache system
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Activity, Database, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface CacheStats {
  success: boolean;
  username: string;
  cache: {
    profile: any[];
    repositories: any[];
    contributions: any[];
    stats: any[];
    summary: {
      totalCacheEntries: number;
      totalFetches: number;
      totalErrors: number;
    };
  };
  analytics: {
    summary: {
      totalRequests: number;
      cacheHits: number;
      cacheMisses: number;
      edgeHits: number;
      staleHits: number;
      errors: number;
      averageResponseTime: number;
      cacheTypes: {
        profile: number;
        repos: number;
        contributions: number;
        stats: number;
      };
    };
    recent: any[];
  };
}

interface CacheHealth {
  success: boolean;
  username: string;
  health: {
    profile: {
      status: 'healthy' | 'stale' | 'expired' | 'unhealthy' | 'missing';
      expired?: boolean;
      stale?: boolean;
      errorCount?: number;
      lastFetch?: string;
    };
    repositories: Array<{
      status: 'healthy' | 'stale' | 'expired' | 'unhealthy';
      expired: boolean;
      stale: boolean;
      errorCount: number;
      lastFetch: string;
    }>;
    contributions: Array<{
      year: number;
      status: 'healthy' | 'stale' | 'expired' | 'unhealthy';
      expired: boolean;
      stale: boolean;
      errorCount: number;
      lastFetch: string;
    }>;
    stats: {
      status: 'healthy' | 'stale' | 'expired' | 'unhealthy' | 'missing';
      expired?: boolean;
      stale?: boolean;
      errorCount?: number;
      lastFetch?: string;
    };
  };
}

export function GitHubCacheMonitor() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [health, setHealth] = useState<CacheHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setError(null);

      // Try to fetch stats first
      const statsResponse = await fetch('/api/admin/github-cache?action=stats');

      if (!statsResponse.ok) {
        // If the API doesn't exist yet, show a setup message
        if (statsResponse.status === 404) {
          setError('GitHub cache system not yet set up. Please run the database migration first.');
          return;
        }
        throw new Error(`Failed to fetch stats: ${statsResponse.status}`);
      }

      const statsData = await statsResponse.json();

      // Try to fetch health data
      const healthResponse = await fetch('/api/admin/github-cache?action=health');
      let healthData = null;

      if (healthResponse.ok) {
        healthData = await healthResponse.json();
      } else {
        console.warn('Health endpoint not available, using fallback data');
        // Provide fallback health data
        healthData = {
          success: true,
          username: 'unknown',
          health: {
            profile: { status: 'missing' },
            repositories: [],
            contributions: [],
            stats: { status: 'missing' }
          }
        };
      }

      setStats(statsData);
      setHealth(healthData);
    } catch (err) {
      console.error('Cache data fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleInvalidateCache = async () => {
    try {
      const response = await fetch('/api/admin/github-cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'invalidate' }),
      });

      if (response.ok) {
        await fetchData(); // Refresh data after invalidation
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to invalidate cache');
    }
  };

  const handleRefreshCache = async (type?: string) => {
    try {
      const response = await fetch('/api/admin/github-cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refresh', type }),
      });

      if (response.ok) {
        await fetchData(); // Refresh data after cache refresh
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh cache');
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: 'default',
      stale: 'secondary',
      expired: 'destructive',
      unhealthy: 'destructive',
      missing: 'outline',
    } as const;

    const colors = {
      healthy: 'text-green-600',
      stale: 'text-yellow-600',
      expired: 'text-red-600',
      unhealthy: 'text-red-600',
      missing: 'text-gray-600',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        <span className={colors[status as keyof typeof colors] || 'text-gray-600'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        Loading cache data...
      </div>
    );
  }

  if (error) {
    // Check if this is a setup error
    const isSetupError = error.includes('not yet set up') || error.includes('migration');

    return (
      <div className="space-y-4">
        <Alert variant={isSetupError ? "default" : "destructive"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {isSetupError ? (
              <div className="space-y-2">
                <p><strong>GitHub Cache System Setup Required</strong></p>
                <p>{error}</p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Setup Steps:</p>
                  <ol className="text-sm list-decimal list-inside space-y-1 ml-4">
                    <li>Run database migration: <code className="bg-muted px-1 rounded">npx prisma db push</code></li>
                    <li>Generate Prisma client: <code className="bg-muted px-1 rounded">npx prisma generate</code></li>
                    <li>Run setup script: <code className="bg-muted px-1 rounded">npm run cache:setup</code></li>
                    <li>Deploy to Netlify to enable edge functions</li>
                  </ol>
                </div>
              </div>
            ) : (
              <>
                Error loading cache data: {error}
                <Button variant="outline" size="sm" onClick={handleRefresh} className="ml-2">
                  Retry
                </Button>
              </>
            )}
          </AlertDescription>
        </Alert>

        {isSetupError && (
          <Card>
            <CardHeader>
              <CardTitle>GitHub Cache System</CardTitle>
              <CardDescription>
                Advanced caching system for GitHub API responses using Netlify Edge Functions and Neon PostgreSQL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Features:</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside ml-4">
                    <li>Edge-based caching with global distribution</li>
                    <li>Intelligent stale-while-revalidate strategy</li>
                    <li>Real-time analytics and monitoring</li>
                    <li>Automatic cache invalidation and refresh</li>
                    <li>Rate limit optimization</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Benefits:</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside ml-4">
                    <li>Faster response times (~50ms vs 200-1000ms)</li>
                    <li>Reduced GitHub API rate limit usage</li>
                    <li>Better user experience with fallback data</li>
                    <li>Comprehensive performance monitoring</li>
                  </ul>
                </div>

                <Button onClick={handleRefresh} className="w-full">
                  Check Setup Status
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  const hitRate = stats?.analytics?.summary?.totalRequests > 0
    ? ((stats.analytics.summary.cacheHits + stats.analytics.summary.edgeHits + stats.analytics.summary.staleHits) / stats.analytics.summary.totalRequests * 100).toFixed(1)
    : '0';

  // Provide fallback data if analytics are not available
  const safeStats = {
    analytics: {
      summary: {
        totalRequests: 0,
        cacheHits: 0,
        cacheMisses: 0,
        edgeHits: 0,
        staleHits: 0,
        errors: 0,
        averageResponseTime: 0,
        cacheTypes: {
          profile: 0,
          repos: 0,
          contributions: 0,
          stats: 0,
        },
      },
      recent: [],
    },
    cache: {
      summary: {
        totalCacheEntries: 0,
        totalFetches: 0,
        totalErrors: 0,
      },
      profile: [],
      repositories: [],
      contributions: [],
      stats: [],
    },
    ...stats,
  };

  const safeHealth = {
    health: {
      profile: { status: 'missing' as const },
      repositories: [],
      contributions: [],
      stats: { status: 'missing' as const },
    },
    ...health,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">GitHub Cache Monitor</h2>
          <p className="text-muted-foreground">
            Real-time monitoring of GitHub API caching system
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleInvalidateCache}
          >
            Clear Cache
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hitRate}%</div>
            <p className="text-xs text-muted-foreground">
              {safeStats.analytics.summary.totalRequests} total requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(safeStats.analytics.summary.averageResponseTime)}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Entries</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {safeStats.cache.summary.totalCacheEntries}
            </div>
            <p className="text-xs text-muted-foreground">
              Total cached items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {safeStats.analytics.summary.errors}
            </div>
            <p className="text-xs text-muted-foreground">
              Errors in 24h
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="health" className="space-y-4">
        <TabsList>
          <TabsTrigger value="health">Health Status</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Profile Cache
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  {getStatusBadge(safeHealth.health.profile.status)}
                </div>
                {safeHealth.health.profile.lastFetch && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Last updated: {new Date(safeHealth.health.profile.lastFetch).toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Repositories Cache
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {safeHealth.health.repositories.map((repo, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span>Page {index + 1}:</span>
                      {getStatusBadge(repo.status)}
                    </div>
                  ))}
                  {safeHealth.health.repositories.length === 0 && (
                    <p className="text-sm text-muted-foreground">No repository cache entries</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Contributions Cache
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {safeHealth.health.contributions.map((contrib) => (
                    <div key={contrib.year} className="flex items-center justify-between">
                      <span>Year {contrib.year}:</span>
                      {getStatusBadge(contrib.status)}
                    </div>
                  ))}
                  {safeHealth.health.contributions.length === 0 && (
                    <p className="text-sm text-muted-foreground">No contribution cache entries</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Stats Cache
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  {getStatusBadge(safeHealth.health.stats.status)}
                </div>
                {safeHealth.health.stats.lastFetch && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Last updated: {new Date(safeHealth.health.stats.lastFetch).toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Cache Hits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {safeStats.analytics.summary.cacheHits}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Edge Hits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {safeStats.analytics.summary.edgeHits}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Stale Hits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {safeStats.analytics.summary.staleHits}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Cache Misses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {safeStats.analytics.summary.cacheMisses}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Request Distribution by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Profile</div>
                  <div className="text-lg font-semibold">
                    {safeStats.analytics.summary.cacheTypes.profile}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Repositories</div>
                  <div className="text-lg font-semibold">
                    {safeStats.analytics.summary.cacheTypes.repos}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Contributions</div>
                  <div className="text-lg font-semibold">
                    {safeStats.analytics.summary.cacheTypes.contributions}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Stats</div>
                  <div className="text-lg font-semibold">
                    {safeStats.analytics.summary.cacheTypes.stats}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cache Refresh</CardTitle>
                <CardDescription>
                  Force refresh specific cache types
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRefreshCache('profile')}
                  className="w-full"
                >
                  Refresh Profile Cache
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRefreshCache('contributions')}
                  className="w-full"
                >
                  Refresh Contributions Cache
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRefreshCache()}
                  className="w-full"
                >
                  Refresh All Caches
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cache Statistics</CardTitle>
                <CardDescription>
                  Current cache usage and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Fetches:</span>
                    <span>{safeStats.cache.summary.totalFetches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Errors:</span>
                    <span>{safeStats.cache.summary.totalErrors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profile Entries:</span>
                    <span>{safeStats.cache.profile.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Repo Entries:</span>
                    <span>{safeStats.cache.repositories.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contribution Entries:</span>
                    <span>{safeStats.cache.contributions.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
