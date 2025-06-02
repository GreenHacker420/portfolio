import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const per_page = Math.min(parseInt(searchParams.get('per_page') || '10'), 100);
    
    const githubToken = process.env.GITHUB_TOKEN;
    const githubUsername = process.env.GITHUB_USERNAME || 'GreenHacker420';

    if (!githubToken) {
      console.warn('GitHub token not configured, using mock data');
      return getMockRepos();
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
      console.error('GitHub API error:', response.status);
      return getMockRepos();
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
    return getMockRepos();
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
    repos: mockRepos,
    total_count: mockRepos.length,
    page: 1,
    per_page: 10
  });
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
