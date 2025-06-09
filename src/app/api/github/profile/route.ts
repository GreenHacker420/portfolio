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

    const githubToken = process.env.GITHUB_TOKEN;
    const githubUsername = process.env.GITHUB_USERNAME || 'GreenHacker420';

    if (!githubToken) {
      console.error('GitHub token not configured');
      return NextResponse.json(
        { error: 'GitHub API not configured' },
        { status: 503 }
      );
    }

    // Fetch real GitHub profile data
    const response = await fetch(`https://api.github.com/users/${githubUsername}`, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-App'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('GitHub API error:', response.status, response.statusText);
      
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

    const userData = await response.json();

    const profileData = {
      login: userData.login,
      name: userData.name || userData.login,
      bio: userData.bio || 'Full-stack developer passionate about AI and open source',
      avatar_url: userData.avatar_url,
      html_url: userData.html_url,
      public_repos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      location: userData.location,
      blog: userData.blog,
      twitter_username: userData.twitter_username,
      company: userData.company,
    };

    return NextResponse.json({
      success: true,
      data: profileData,
      cached: false,
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


