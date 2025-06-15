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
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
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
          {
            error: 'GitHub API rate limit exceeded',
            rateLimit: result.rateLimit
          },
          { status: 429 }
        );
      }

      if (result.error?.includes('token required') || result.error?.includes('not configured')) {
        console.warn('GitHub token not configured, using mock data');
        return getMockRepos();
      }

      // Fallback to mock data on other errors
      console.warn('GitHub repos API error, using mock data:', result.error);
      return getMockRepos();
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

    return NextResponse.json({
      success: true,
      data: formattedRepos,
      total_count: formattedRepos.length,
      page,
      per_page,
      cached: result.cached || false,
      cacheAge: result.cacheAge,
      rateLimit: result.rateLimit,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('GitHub repos API error:', error);
    return getMockRepos();
  } finally {
    // Clean up Prisma connection
    await prisma.$disconnect();
  }
}

function getMockRepos() {
  const mockRepos = [
    {
      id: 1,
      name: 'portfolio-nextjs',
      full_name: 'GreenHacker420/portfolio-nextjs',
      description: 'Modern portfolio website built with Next.js, Three.js, and AI integration',
      html_url: 'https://github.com/GreenHacker420/portfolio-nextjs',
      homepage: 'https://greenhacker420.vercel.app',
      language: 'TypeScript',
      stargazers_count: 15,
      forks_count: 3,
      watchers_count: 15,
      size: 2048,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: new Date().toISOString(),
      pushed_at: new Date().toISOString(),
      topics: ['nextjs', 'portfolio', 'threejs', 'ai', 'typescript'],
      license: 'MIT',
      default_branch: 'main',
      open_issues_count: 2,
    },
    {
      id: 2,
      name: 'ai-chat-assistant',
      full_name: 'GreenHacker420/ai-chat-assistant',
      description: 'Intelligent chat assistant powered by Gemini AI with advanced conversation capabilities',
      html_url: 'https://github.com/GreenHacker420/ai-chat-assistant',
      homepage: null,
      language: 'Python',
      stargazers_count: 8,
      forks_count: 2,
      watchers_count: 8,
      size: 1024,
      created_at: '2024-02-01T00:00:00Z',
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      pushed_at: new Date(Date.now() - 86400000).toISOString(),
      topics: ['ai', 'chatbot', 'gemini', 'python', 'machine-learning'],
      license: 'Apache-2.0',
      default_branch: 'main',
      open_issues_count: 1,
    },
    {
      id: 3,
      name: 'react-3d-components',
      full_name: 'GreenHacker420/react-3d-components',
      description: 'Collection of reusable 3D React components using Three.js and React Three Fiber',
      html_url: 'https://github.com/GreenHacker420/react-3d-components',
      homepage: 'https://react-3d-components.vercel.app',
      language: 'JavaScript',
      stargazers_count: 12,
      forks_count: 4,
      watchers_count: 12,
      size: 1536,
      created_at: '2023-11-20T00:00:00Z',
      updated_at: new Date(Date.now() - 172800000).toISOString(),
      pushed_at: new Date(Date.now() - 172800000).toISOString(),
      topics: ['react', 'threejs', 'components', '3d', 'webgl'],
      license: 'MIT',
      default_branch: 'main',
      open_issues_count: 0,
    }
  ];

  return NextResponse.json({
    success: true,
    data: mockRepos,
    total_count: mockRepos.length,
    page: 1,
    per_page: 10,
    cached: false,
    mock: true,
    timestamp: new Date().toISOString()
  });
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
