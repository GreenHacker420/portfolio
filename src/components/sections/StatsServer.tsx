import { GitHubData, GitHubRepo, GitHubLanguage, GitHubActivity } from '@/types/github';
import { GitHubStatsCards } from '@/components/github/GitHubStatsCards';
import { GitHubContributionHeatmap } from '@/components/github/GitHubContributionHeatmap';
import { GitHubAIAnalysis } from '@/components/github/GitHubAIAnalysis';
import { getGitHubService } from '@/services/githubService';

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
    percentage: Math.round((count / total) * 100),
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

export default async function Stats() {
  let data: GitHubData | null = null;
  let error: string | null = null;

  try {
    const svc = getGitHubService();
    const year = new Date().getFullYear();
    const [profileRes, reposRes, contribRes] = await Promise.all([
      svc.fetchProfile(false),
      svc.fetchRepositories(false, 1, 100),
      svc.fetchContributions(year),
    ]);

    if (!profileRes.success || !reposRes.success) {
      error = profileRes.error || reposRes.error || 'Failed to load GitHub data';
    } else {
      const profile = profileRes.data!;
      const repos = reposRes.data || [];
      const contributions = contribRes.success && contribRes.data ? contribRes.data : { totalContributions: 0, weeks: [], months: [] } as any;

      data = {
        profile,
        repositories: repos,
        contributions,
        languages: computeLanguages(repos),
        stats: computeStats(profile, repos),
        topRepositories: computeTopRepos(repos),
        recentActivity: computeRecentActivity(repos),
      };
    }
  } catch (e: any) {
    error = e?.message || 'Failed to build GitHub data';
  }

  return (
    <section id="stats" className="py-20 bg-github-light">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">GitHub Statistics & Insights</h2>
          <p className="text-github-text max-w-2xl mx-auto">
            Real-time GitHub analytics powered by AI insights and comprehensive contribution tracking
          </p>
        </div>

        <div className="space-y-8">
          <GitHubStatsCards
            data={data}
            isLoading={false}
            error={error}
          />

          <GitHubContributionHeatmap
            contributions={data?.contributions || null}
            isLoading={false}
            error={error}
            className="w-full"
          />

        </div>
      </div>
    </section>
  );
}

