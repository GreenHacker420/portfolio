/**
 * GitHub Cache Management API Route
 * Provides cache statistics, monitoring, and invalidation capabilities
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createGitHubCacheService } from '@/services/githubCacheService';

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * GET - Get cache statistics and status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const username = searchParams.get('username') || process.env.GITHUB_USERNAME || 'GreenHacker420';

    // Initialize cache service
    const cacheService = createGitHubCacheService(prisma, username);

    if (action === 'stats') {
      // Get comprehensive cache statistics
      const stats = await cacheService.getCacheStats();

      // Check if cache models are available
      const cacheModelsAvailable = !!(
        (prisma as any).gitHubCacheAnalytics &&
        (prisma as any).gitHubProfileCache &&
        (prisma as any).gitHubRepoCache &&
        (prisma as any).gitHubContributionCache &&
        (prisma as any).gitHubStatsCache
      );

      if (!cacheModelsAvailable) {
        return NextResponse.json({
          success: false,
          error: 'GitHub cache system not yet set up. Please run the database migration first.',
          setup: {
            required: true,
            steps: [
              'Run: npx prisma db push',
              'Run: npx prisma generate',
              'Run: npm run cache:setup',
              'Deploy to Netlify'
            ]
          },
          timestamp: new Date().toISOString(),
        }, { status: 503 });
      }
      
      // Get recent analytics (only if analytics model is available)
      let recentAnalytics = [];
      if ((prisma as any).gitHubCacheAnalytics) {
        try {
          recentAnalytics = await (prisma as any).gitHubCacheAnalytics.findMany({
            where: {
              username: username,
              createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 100,
          });
        } catch (error) {
          console.warn('Failed to fetch analytics:', error);
        }
      }

      // Calculate analytics summary
      const analyticsSummary = {
        totalRequests: recentAnalytics.length,
        cacheHits: recentAnalytics.filter(a => a.operation === 'hit').length,
        cacheMisses: recentAnalytics.filter(a => a.operation === 'miss').length,
        edgeHits: recentAnalytics.filter(a => a.operation === 'edge-hit').length,
        staleHits: recentAnalytics.filter(a => a.operation === 'stale-hit').length,
        errors: recentAnalytics.filter(a => a.operation === 'error').length,
        averageResponseTime: recentAnalytics
          .filter(a => a.responseTime)
          .reduce((sum, a) => sum + (a.responseTime || 0), 0) / 
          Math.max(recentAnalytics.filter(a => a.responseTime).length, 1),
        cacheTypes: {
          profile: recentAnalytics.filter(a => a.cacheType === 'profile').length,
          repos: recentAnalytics.filter(a => a.cacheType === 'repos').length,
          contributions: recentAnalytics.filter(a => a.cacheType === 'contributions').length,
          stats: recentAnalytics.filter(a => a.cacheType === 'stats').length,
        },
      };

      return NextResponse.json({
        success: true,
        username,
        cache: stats,
        analytics: {
          summary: analyticsSummary,
          recent: recentAnalytics.slice(0, 20), // Last 20 requests
        },
        timestamp: new Date().toISOString(),
      });
    }

    if (action === 'health') {
      // Check cache health
      const now = new Date();

      // Check if cache models are available first
      const cacheModelsAvailable = !!(
        (prisma as any).gitHubProfileCache &&
        (prisma as any).gitHubRepoCache &&
        (prisma as any).gitHubContributionCache &&
        (prisma as any).gitHubStatsCache
      );

      if (!cacheModelsAvailable) {
        return NextResponse.json({
          success: false,
          error: 'GitHub cache system not yet set up. Please run the database migration first.',
          timestamp: new Date().toISOString(),
        }, { status: 503 });
      }

      const promises = [];

      // Profile cache
      promises.push(
        (prisma as any).gitHubProfileCache.findUnique({
          where: { username },
          select: { expiresAt: true, errorCount: true, isStale: true, lastFetch: true },
        }).catch(() => null)
      );

      // Repo cache
      promises.push(
        (prisma as any).gitHubRepoCache.findMany({
          where: { username },
          select: { expiresAt: true, errorCount: true, isStale: true, lastFetch: true },
        }).catch(() => [])
      );

      // Contribution cache
      promises.push(
        (prisma as any).gitHubContributionCache.findMany({
          where: { username },
          select: { expiresAt: true, errorCount: true, isStale: true, lastFetch: true, year: true },
        }).catch(() => [])
      );

      // Stats cache
      promises.push(
        (prisma as any).gitHubStatsCache.findUnique({
          where: { username },
          select: { expiresAt: true, errorCount: true, isStale: true, lastFetch: true },
        }).catch(() => null)
      );

      const [profileCache, repoCache, contributionCache, statsCache] = await Promise.all(promises);

      const health = {
        profile: profileCache ? {
          expired: now > profileCache.expiresAt,
          stale: profileCache.isStale,
          errorCount: profileCache.errorCount,
          lastFetch: profileCache.lastFetch,
          status: profileCache.errorCount > 5 ? 'unhealthy' : 
                  now > profileCache.expiresAt ? 'expired' : 
                  profileCache.isStale ? 'stale' : 'healthy',
        } : { status: 'missing' },
        repositories: repoCache.map(cache => ({
          expired: now > cache.expiresAt,
          stale: cache.isStale,
          errorCount: cache.errorCount,
          lastFetch: cache.lastFetch,
          status: cache.errorCount > 5 ? 'unhealthy' : 
                  now > cache.expiresAt ? 'expired' : 
                  cache.isStale ? 'stale' : 'healthy',
        })),
        contributions: contributionCache.map(cache => ({
          year: cache.year,
          expired: now > cache.expiresAt,
          stale: cache.isStale,
          errorCount: cache.errorCount,
          lastFetch: cache.lastFetch,
          status: cache.errorCount > 5 ? 'unhealthy' : 
                  now > cache.expiresAt ? 'expired' : 
                  cache.isStale ? 'stale' : 'healthy',
        })),
        stats: statsCache ? {
          expired: now > statsCache.expiresAt,
          stale: statsCache.isStale,
          errorCount: statsCache.errorCount,
          lastFetch: statsCache.lastFetch,
          status: statsCache.errorCount > 5 ? 'unhealthy' : 
                  now > statsCache.expiresAt ? 'expired' : 
                  statsCache.isStale ? 'stale' : 'healthy',
        } : { status: 'missing' },
      };

      return NextResponse.json({
        success: true,
        username,
        health,
        timestamp: new Date().toISOString(),
      });
    }

    // Default: return basic cache info
    const promises = [];

    // Only query models that exist
    promises.push(
      (prisma as any).gitHubProfileCache ?
        (prisma as any).gitHubProfileCache.count({ where: { username } }).catch(() => 0) :
        Promise.resolve(0)
    );

    promises.push(
      (prisma as any).gitHubRepoCache ?
        (prisma as any).gitHubRepoCache.count({ where: { username } }).catch(() => 0) :
        Promise.resolve(0)
    );

    promises.push(
      (prisma as any).gitHubContributionCache ?
        (prisma as any).gitHubContributionCache.count({ where: { username } }).catch(() => 0) :
        Promise.resolve(0)
    );

    promises.push(
      (prisma as any).gitHubStatsCache ?
        (prisma as any).gitHubStatsCache.count({ where: { username } }).catch(() => 0) :
        Promise.resolve(0)
    );

    promises.push(
      (prisma as any).gitHubCacheAnalytics ?
        (prisma as any).gitHubCacheAnalytics.count({
          where: {
            username,
            createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
          }
        }).catch(() => 0) :
        Promise.resolve(0)
    );

    const cacheInfo = await Promise.all(promises);

    return NextResponse.json({
      success: true,
      username,
      summary: {
        profileCacheEntries: cacheInfo[0],
        repoCacheEntries: cacheInfo[1],
        contributionCacheEntries: cacheInfo[2],
        statsCacheEntries: cacheInfo[3],
        analyticsEntries24h: cacheInfo[4],
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('GitHub cache management error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect().catch(console.error);
  }
}

/**
 * POST - Invalidate cache or perform cache operations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, username: bodyUsername } = body;
    const username = bodyUsername || process.env.GITHUB_USERNAME || 'GreenHacker420';

    // Initialize cache service
    const cacheService = createGitHubCacheService(prisma, username);

    if (action === 'invalidate') {
      // Invalidate all cache for the user
      await cacheService.invalidateCache();

      return NextResponse.json({
        success: true,
        message: `Cache invalidated for user: ${username}`,
        timestamp: new Date().toISOString(),
      });
    }

    if (action === 'cleanup') {
      // Clean up old analytics data (older than 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const deletedAnalytics = await prisma.gitHubCacheAnalytics.deleteMany({
        where: {
          username,
          createdAt: { lt: thirtyDaysAgo },
        },
      });

      return NextResponse.json({
        success: true,
        message: `Cleaned up ${deletedAnalytics.count} old analytics entries`,
        timestamp: new Date().toISOString(),
      });
    }

    if (action === 'refresh') {
      // Force refresh all cache entries
      const { type } = body;
      
      if (type === 'profile') {
        await cacheService.getProfile({ forceRefresh: true, fallbackToAPI: true });
      } else if (type === 'contributions') {
        const year = body.year || new Date().getFullYear();
        await cacheService.getContributions(year, { forceRefresh: true, fallbackToAPI: true });
      } else {
        // Refresh all
        await Promise.all([
          cacheService.getProfile({ forceRefresh: true, fallbackToAPI: true }),
          cacheService.getContributions(new Date().getFullYear(), { forceRefresh: true, fallbackToAPI: true }),
        ]);
      }

      return NextResponse.json({
        success: true,
        message: `Cache refreshed for ${type || 'all'} data`,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action. Supported actions: invalidate, cleanup, refresh',
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );

  } catch (error) {
    console.error('GitHub cache management error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect().catch(console.error);
  }
}

/**
 * DELETE - Delete specific cache entries
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const username = searchParams.get('username') || process.env.GITHUB_USERNAME || 'GreenHacker420';

    if (!type) {
      return NextResponse.json(
        {
          success: false,
          error: 'Type parameter is required (profile, repos, contributions, stats, analytics)',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    let deletedCount = 0;

    switch (type) {
      case 'profile':
        const profileResult = await prisma.gitHubProfileCache.deleteMany({
          where: { username },
        });
        deletedCount = profileResult.count;
        break;

      case 'repos':
        const repoResult = await prisma.gitHubRepoCache.deleteMany({
          where: { username },
        });
        deletedCount = repoResult.count;
        break;

      case 'contributions':
        const year = searchParams.get('year');
        const contributionResult = await prisma.gitHubContributionCache.deleteMany({
          where: { 
            username,
            ...(year && { year: parseInt(year) }),
          },
        });
        deletedCount = contributionResult.count;
        break;

      case 'stats':
        const statsResult = await prisma.gitHubStatsCache.deleteMany({
          where: { username },
        });
        deletedCount = statsResult.count;
        break;

      case 'analytics':
        const analyticsResult = await prisma.gitHubCacheAnalytics.deleteMany({
          where: { username },
        });
        deletedCount = analyticsResult.count;
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid type. Supported types: profile, repos, contributions, stats, analytics',
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedCount} ${type} cache entries for user: ${username}`,
      deletedCount,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('GitHub cache deletion error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect().catch(console.error);
  }
}
