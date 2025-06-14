import { NextResponse } from 'next/server';
import { githubService } from '@/services/githubService';

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

    // Use the new GitHub service
    const result = await githubService.fetchProfile(forceRefresh);

    if (!result.success) {
      console.error('GitHub profile service error:', result.error);

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
      cached: result.cached || false,
      cacheAge: result.cacheAge,
      rateLimit: result.rateLimit,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('GitHub profile API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub profile' },
      { status: 500 }
    );
  }
}


