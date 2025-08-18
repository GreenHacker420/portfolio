import { GitHubData, GitHubAPIResponse, GITHUB_API_ENDPOINTS } from '@/types/github';
import { GitHubStatsCards } from '@/components/github/GitHubStatsCards';
import { GitHubContributionHeatmap } from '@/components/github/GitHubContributionHeatmap';
import { GitHubAIAnalysis } from '@/components/github/GitHubAIAnalysis';

export default async function Stats() {
  let data: GitHubData | null = null;
  let error: string | null = null;

  try {
    const res = await fetch(GITHUB_API_ENDPOINTS.AGGREGATE, { next: { revalidate: 600 } });
    const body: GitHubAPIResponse<GitHubData> = await res.json().catch(() => ({ success: false, error: 'Invalid JSON from aggregate' } as any));
    if (body.success && body.data) {
      data = body.data;
    } else {
      error = body.error || `Aggregate fetch failed with ${res.status}`;
    }
  } catch (e: any) {
    error = e?.message || 'Failed to fetch aggregate data';
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
            onRefresh={() => {}}
            isRefreshing={false}
          />

          <GitHubContributionHeatmap
            contributions={data?.contributions || null}
            isLoading={false}
            error={error}
            className="w-full"
          />

          <GitHubAIAnalysis
            githubData={data}
            isLoading={false}
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}

