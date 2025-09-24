import { NextResponse } from 'next/server';
import { GitHubContributionCalendar, GitHubContribution } from '@/types/github';
import { githubService } from '@/services/githubService';
import { PrismaClient } from '@prisma/client';
import { createGitHubCacheService } from '@/services/githubCacheService';

// Initialize Prisma client
const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Basic rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const forceRefresh = searchParams.get('refresh') === 'true';

    // Create GitHub cache service instance
    const cacheService = createGitHubCacheService(prisma);

    // Try to get from cache first
    const cacheResult = await cacheService.getContributions(year, {
      forceRefresh,
      useEdgeCache: false, // Edge cache is disabled
      fallbackToAPI: false, // We'll handle API fallback manually
    });

    // If cache has data, return it
    if (cacheResult.data) {
      return NextResponse.json(
        { success: true, data: cacheResult.data, cached: cacheResult.cached, rateLimit: cacheResult.rateLimit, timestamp: new Date().toISOString() },
        { status: 200, headers: { 'Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=21600' } }
      );
    }

    // Fallback to the existing GitHub service for API calls
    const result = await githubService.fetchContributions(year, forceRefresh);

    if (!result.success) {
      console.error('GitHub contributions service error:', result.error);

      // Handle specific error cases
      if (result.error?.includes('rate limit')) {
        return NextResponse.json(
          { success: false, error: 'GitHub API rate limit exceeded', rateLimit: result.rateLimit },
          { status: 429, headers: { 'Cache-Control': 'no-store' } }
        );
      }

      if (result.error?.includes('token required')) {
        console.warn('GitHub token not configured');
        return NextResponse.json({ 
          success: false, 
          error: 'GitHub token not configured. Please add GITHUB_TOKEN to your environment variables.',
          data: { weeks: [], totalContributions: 0 }
        }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
      }

      // Return error on other failures
      console.error('GitHub contributions API error:', result.error);
      return NextResponse.json({ 
        success: false, 
        error: result.error || 'Failed to fetch GitHub contributions',
        data: { weeks: [], totalContributions: 0 }
      }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
    }

    return NextResponse.json(
      { success: true, data: result.data, cached: result.cached || false, rateLimit: result.rateLimit, timestamp: new Date().toISOString() },
      { status: 200, headers: { 'Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=21600' } }
    );

  } catch (error) {
    console.error('GitHub contributions API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error while fetching contributions',
      data: { weeks: [], totalContributions: 0 }
    }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  } finally {
    // Clean up Prisma connection
    await prisma.$disconnect();
  }
}

function transformContributionsToCalendar(
  contributions: GitHubContribution[],
  year: number
): GitHubContributionCalendar {
  const weeks: any[] = [];
  const months: any[] = [];

  // Group contributions by weeks
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  // Find the first Sunday of the year or before
  const firstSunday = new Date(startDate);
  firstSunday.setDate(startDate.getDate() - startDate.getDay());

  let currentDate = new Date(firstSunday);
  let weekIndex = 0;

  while (currentDate <= endDate) {
    const week = {
      contributionDays: [] as GitHubContribution[],
      firstDay: currentDate.toISOString().split('T')[0],
    };

    // Add 7 days to the week
    for (let day = 0; day < 7; day++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const contribution = contributions.find(c => c.date === dateStr) || {
        date: dateStr,
        count: 0,
        level: 0,
      };

      week.contributionDays.push(contribution);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    weeks.push(week);
    weekIndex++;

    // Break if we've gone past the year
    if (currentDate.getFullYear() > year) {
      break;
    }
  }

  // Generate month information
  for (let month = 0; month < 12; month++) {
    const monthDate = new Date(year, month, 1);
    months.push({
      name: monthDate.toLocaleDateString('en-US', { month: 'long' }),
      year,
      firstDay: monthDate.toISOString().split('T')[0],
      totalWeeks: Math.ceil(new Date(year, month + 1, 0).getDate() / 7),
    });
  }

  const totalContributions = contributions.reduce((sum, c) => sum + c.count, 0);

  return {
    totalContributions,
    weeks,
    months,
  };
}

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  userLimit.count++;
  return false;
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
