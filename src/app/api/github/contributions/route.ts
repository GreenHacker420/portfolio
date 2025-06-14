import { NextResponse } from 'next/server';
import { GitHubContributionCalendar, GitHubContribution } from '@/types/github';
import { githubService } from '@/services/githubService';
import { createGitHubCacheService } from '@/services/githubCacheService';
import { PrismaClient } from '@prisma/client';

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
    const useEdgeCache = searchParams.get('edge') !== 'false'; // Default to true

    // Initialize cache service
    const cacheService = createGitHubCacheService(prisma);

    // Try cache service first (with edge cache support)
    const cacheResult = await cacheService.getContributions(year, {
      forceRefresh,
      useEdgeCache,
      fallbackToAPI: false, // We'll handle API fallback manually
    });

    // If cache service has data, return it
    if (cacheResult.data) {
      return NextResponse.json({
        success: true,
        contributions: cacheResult.data,
        year,
        cached: cacheResult.cached,
        stale: cacheResult.stale,
        age: cacheResult.age,
        source: cacheResult.source,
        rateLimit: cacheResult.rateLimit,
        timestamp: new Date().toISOString()
      });
    }

    // Fallback to existing GitHub service for fresh data
    const result = await githubService.fetchContributions(year, forceRefresh);

    if (!result.success) {
      console.error('GitHub contributions service error:', result.error);

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

      if (result.error?.includes('token required')) {
        console.warn('GitHub token not configured, using mock data');
        return getMockContributions(year);
      }

      // Fallback to mock data on other errors
      console.warn('GitHub contributions API error, using mock data:', result.error);
      return getMockContributions(year);
    }

    return NextResponse.json({
      success: true,
      contributions: result.data,
      year,
      cached: result.cached || false,
      cacheAge: result.cacheAge,
      source: 'api',
      rateLimit: result.rateLimit,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('GitHub contributions API error:', error);
    return getMockContributions(new Date().getFullYear());
  } finally {
    // Clean up Prisma connection
    await prisma.$disconnect().catch(console.error);
  }
}

function getMockContributions(year: number) {
  // Generate simple mock contribution data
  const mockContributions: GitHubContribution[] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  const currentDate = new Date();

  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    // Don't generate contributions for future dates
    if (date > currentDate) {
      mockContributions.push({
        date: date.toISOString().split('T')[0],
        count: 0,
        level: 0,
      });
      continue;
    }

    // Generate random contributions with some patterns
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseActivity = isWeekend ? 0.3 : 0.8;

    let count = 0;
    if (Math.random() < baseActivity) {
      count = Math.floor(Math.random() * 12) + 1;
    }

    const level = count === 0 ? 0 : Math.min(Math.floor((count - 1) / 3) + 1, 4);

    mockContributions.push({
      date: date.toISOString().split('T')[0],
      count,
      level,
    });
  }

  const mockCalendar = transformContributionsToCalendar(mockContributions, year);

  return NextResponse.json({
    success: true,
    contributions: mockCalendar,
    year,
    mock: true,
    timestamp: new Date().toISOString()
  });
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
