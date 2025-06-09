import { NextResponse } from 'next/server';

// Rate limiting helper
const rateLimit = new Map();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 60; // 60 requests per minute

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  const limit = rateLimit.get(ip);
  if (now > limit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (limit.count >= maxRequests) {
    return true;
  }

  limit.count++;
  return false;
}

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

    const githubToken = process.env.GITHUB_TOKEN;
    const githubUsername = process.env.GITHUB_USERNAME || 'GreenHacker420';

    if (!githubToken) {
      console.error('GitHub token not configured');
      return NextResponse.json(
        { error: 'GitHub API not configured' },
        { status: 503 }
      );
    }

    // Fetch real GitHub data
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${githubUsername}`, {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-App'
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      }),
      fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`, {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-App'
        },
        next: { revalidate: 3600 }
      })
    ]);

    if (!userResponse.ok || !reposResponse.ok) {
      console.error('GitHub API error:', userResponse.status, reposResponse.status);
      return NextResponse.json(
        { error: 'GitHub API rate limit exceeded' },
        { status: 429 }
      );
    }

    const userData = await userResponse.json();
    const reposData = await reposResponse.json();

    // Calculate stats from real data
    const stats = calculateStats(reposData);
    const languages = calculateLanguages(reposData);

    const realStats = {
      user: {
        login: userData.login,
        name: userData.name || userData.login,
        bio: userData.bio || 'Full-stack developer passionate about AI and open source',
        public_repos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        created_at: userData.created_at,
        avatar_url: userData.avatar_url,
        html_url: userData.html_url,
      },
      stats,
      languages,
      recentActivity: getRecentActivity(reposData),
    };

    return NextResponse.json(realStats, { status: 200 });
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub statistics' },
      { status: 500 }
    );
  }
}



function calculateStats(repos: any[]) {
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

  return {
    totalStars,
    totalForks,
    totalRepos: repos.length,
    totalCommits: 0, // Would need additional API calls to get accurate commit count
    totalPRs: 0, // Would need additional API calls
    totalIssues: 0, // Would need additional API calls
    contributedRepos: repos.filter(repo => !repo.fork).length,
  };
}

function calculateLanguages(repos: any[]) {
  const languageCount: { [key: string]: number } = {};
  const languageColors: { [key: string]: string } = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Java: '#b07219',
    'C++': '#f34b7d',
    Go: '#00ADD8',
    Rust: '#dea584',
    PHP: '#4F5D95',
  };

  repos.forEach(repo => {
    if (repo.language) {
      languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
    }
  });

  const total = Object.values(languageCount).reduce((sum: number, count: number) => sum + count, 0);

  return Object.entries(languageCount)
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / total) * 100),
      color: languageColors[name] || '#858585',
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5); // Top 5 languages
}

function getRecentActivity(repos: any[]) {
  return repos
    .filter(repo => repo.pushed_at)
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
    .slice(0, 5)
    .map(repo => ({
      type: 'push',
      repo: repo.name,
      message: `Updated ${repo.name}`,
      date: repo.pushed_at,
      url: repo.html_url,
    }));
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
