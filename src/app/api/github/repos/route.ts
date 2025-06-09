import { NextResponse } from 'next/server';

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

    const githubToken = process.env.GITHUB_TOKEN;
    const githubUsername = process.env.GITHUB_USERNAME || 'GreenHacker420';

    if (!githubToken) {
      console.error('GitHub token not configured');
      return NextResponse.json(
        { error: 'GitHub API not configured' },
        { status: 503 }
      );
    }

    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?page=${page}&per_page=${per_page}&sort=updated&type=owner`,
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-App'
        },
        next: { revalidate: 1800 } // Cache for 30 minutes
      }
    );

    if (!response.ok) {
      console.error('GitHub repos API error:', response.status, response.statusText);

      // Check if it's a rate limit error
      if (response.status === 403) {
        const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
        const rateLimitReset = response.headers.get('x-ratelimit-reset');

        console.error('GitHub API rate limit exceeded:', {
          remaining: rateLimitRemaining,
          reset: rateLimitReset
        });
      }

      return NextResponse.json(
        { error: 'GitHub API rate limit exceeded' },
        { status: 429 }
      );
    }

    const repos = await response.json();

    // Filter and format repository data
    const formattedRepos = repos
      .filter((repo: any) => !repo.fork && !repo.private) // Only show original public repos
      .map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
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
      }));

    return NextResponse.json({
      repos: formattedRepos,
      total_count: formattedRepos.length,
      page,
      per_page
    });

  } catch (error) {
    console.error('GitHub repos API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub repositories' },
      { status: 500 }
    );
  }
}


