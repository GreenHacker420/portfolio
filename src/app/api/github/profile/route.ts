import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createGitHubCacheService } from '@/services/githubCacheService';

// Initialize Prisma client
const prisma = new PrismaClient();

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new limit
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return false;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  userLimit.count++;
  return false;
}

export async function GET(request: Request) {
  try {
    // Basic rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Check for force refresh parameter
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('refresh') === 'true';

    // Create GitHub cache service instance
    const cacheService = createGitHubCacheService(prisma);

    // Use the cache service with intelligent caching
    const result = await cacheService.getProfile({
      forceRefresh,
      useEdgeCache: false, // Edge cache is disabled since we removed the edge function
      fallbackToAPI: true,
    });

    if (!result.data) {
      console.error('GitHub profile cache service error:', result.error);

      // Handle specific error cases
      if (result.error?.includes('rate limit')) {
        return NextResponse.json(
          {
            error: 'GitHub API rate limit exceeded',
            rateLimit: result.rateLimit
          },
          { status: 429 }
        );
      }

      if (result.error?.includes('not configured')) {
        return NextResponse.json(
          { error: 'GitHub API not configured' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: result.error || 'Failed to fetch GitHub profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      cached: result.cached,
      stale: result.stale,
      cacheAge: result.age,
      source: result.source,
      rateLimit: result.rateLimit,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('GitHub profile API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub profile' },
      { status: 500 }
    );
  } finally {
    // Clean up Prisma connection
    await prisma.$disconnect();
  }
}


