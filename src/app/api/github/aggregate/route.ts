import { NextResponse } from 'next/server';
import { getGitHubService } from '@/services/githubService';
import { GitHubAPIResponse, GitHubData, GitHubRepo, GitHubLanguage, GitHubActivity } from '@/types/github';

function json<T>(body: GitHubAPIResponse<T>, init?: ResponseInit) {
  return new NextResponse(JSON.stringify(body), {
    status: init?.status || 200,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }),
    },
  });
}

function getRateLimit(headers: Headers) {
  const limit = Number(headers.get('x-ratelimit-limit') || 0);
  const remaining = Number(headers.get('x-ratelimit-remaining') || 0);
  const reset = Number(headers.get('x-ratelimit-reset') || 0);
  return { limit, remaining, reset };
}

function computeLanguages(repos: GitHubRepo[]): GitHubLanguage[] {
  const map = new Map<string, number>();
  for (const r of repos) {
    if (!r.language) continue;
    map.set(r.language, (map.get(r.language) || 0) + 1);
  }
  const total = Array.from(map.values()).reduce((a, b) => a + b, 0) || 1;
  return Array.from(map.entries()).map(([name, count]) => ({
    name,
    value: count,
    color: '#6e7681',
    percentage: (count / total) * 100,
    bytes: count,
  }));
}

function computeStats(profile: any, repos: GitHubRepo[]) {
  const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);
  const totalRepos = repos.length;
  const contributedRepos = repos.filter(r => !r.fork).length;
  const yearOfCoding = new Date().getFullYear() - new Date(profile.created_at).getFullYear();
  return {
    totalStars,
    totalForks,
    totalRepos,
    totalCommits: 0,
    totalPRs: 0,
    totalIssues: 0,
    contributedRepos,
    yearOfCoding,
    currentStreak: 0,
    longestStreak: 0,
    totalContributions: 0,
  };
}

function computeTopRepos(repos: GitHubRepo[]): GitHubRepo[] {
  return [...repos]
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, 5);
}

function computeRecentActivity(repos: GitHubRepo[]): GitHubActivity[] {
  return repos
    .filter(r => !!r.pushed_at)
    .sort((a, b) => new Date(b.pushed_at || 0).getTime() - new Date(a.pushed_at || 0).getTime())
    .slice(0, 5)
    .map(r => ({
      type: 'commit',
      repo: r.full_name,
      date: r.pushed_at!,
      description: `Recent activity in ${r.name}`,
      url: r.html_url,
    }));
}

export async function GET(request: Request) {
  try {
    const svc = getGitHubService();
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get('year');
    const year = yearParam ? parseInt(yearParam) : new Date().getFullYear();

    const [profileRes, reposRes, contribRes] = await Promise.all([
      svc.fetchProfile(false),
      svc.fetchRepositories(false, 1, 100),
      svc.fetchContributions(year),
    ]);

    if (!profileRes.success || !reposRes.success) {
      const error = profileRes.error || reposRes.error || 'Failed to fetch GitHub data';
      const status = /rate limit/i.test(error || '') ? 429 : 500;
      return json({ success: false, error } as any, { status });
    }

    const profile = profileRes.data!;
    const repos = reposRes.data || [];
    const contributions = contribRes.success && contribRes.data ? contribRes.data : { totalContributions: 0, weeks: [], months: [] } as any;

    const languages = computeLanguages(repos);
    const stats = computeStats(profile, repos);
    const topRepositories = computeTopRepos(repos);
    const recentActivity = computeRecentActivity(repos);

    const rateLimit = reposRes.rateLimit || profileRes.rateLimit || contribRes.rateLimit;

    const data: GitHubData = {
      profile,
      repositories: repos,
      contributions,
      languages,
      stats,
      topRepositories,
      recentActivity,
    };

    return json<GitHubData>({ success: true, data, cached: !!(profileRes.cached && reposRes.cached), rateLimit });
  } catch (err) {
    console.error('Aggregate GitHub error:', err);
    return json({ success: false, error: 'Internal server error' } as any, { status: 500 });
  }
}

