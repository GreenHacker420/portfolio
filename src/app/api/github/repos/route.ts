import { NextResponse } from 'next/server';
import { githubService } from '@/services/githubService';
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
        { success: false, error: 'Rate limit exceeded. Please try again later.' },
        { status: 429, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const per_page = Math.min(parseInt(searchParams.get('per_page') || '10'), 100);
    const forceRefresh = searchParams.get('refresh') === 'true';

    // Use the GitHub service with caching
    const result = await githubService.fetchRepositories(forceRefresh, page, per_page);

    if (!result.success) {
      console.error('GitHub repos service error:', result.error);

      // Handle specific error cases
      if (result.error?.includes('rate limit')) {
        return NextResponse.json(
          { success: false, error: 'GitHub API rate limit exceeded', rateLimit: result.rateLimit },
          { status: 429, headers: { 'Cache-Control': 'no-store' } }
        );
      }

      if (result.error?.includes('token required') || result.error?.includes('not configured')) {
        console.warn('GitHub token not configured');
        return NextResponse.json({ 
          success: false, 
          error: 'GitHub token not configured. Please add GITHUB_TOKEN to your environment variables.',
          data: []
        }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
      }

      // Return error on other failures
      console.error('GitHub repos API error:', result.error);
      return NextResponse.json({ 
        success: false, 
        error: result.error || 'Failed to fetch GitHub repositories',
        data: []
      }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
    }

    // Filter and format repository data
    const formattedRepos = result.data
      ?.filter((repo: any) => !repo.fork && !repo.private) // Only show original public repos
      .map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description || '',
        html_url: repo.html_url,
        homepage: repo.homepage || null,
        language: repo.language || null,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        watchers_count: repo.watchers_count,
        size: repo.size,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
        topics: repo.topics || [],
        license: repo.license?.name || null,
        default_branch: repo.default_branch,
        open_issues_count: repo.open_issues_count,
      })) || [];

    return NextResponse.json(
      { success: true, data: formattedRepos, cached: result.cached || false, rateLimit: result.rateLimit, timestamp: new Date().toISOString() },
      { status: 200, headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=600' } }
    );

  } catch (error) {
    console.error('GitHub repos API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error while fetching repositories',
      data: []
    }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  } finally {
    // Clean up Prisma connection
    await prisma.$disconnect();
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
