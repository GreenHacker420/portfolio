import { NextResponse } from 'next/server';
import { getGitHubService } from '@/services/githubService';
import { GitHubAPIResponse, GitHubData, GitHubRepo, GitHubLanguage, GitHubActivity } from '@/types/github';
import { calculateContributionStreaks, calculateTotalContributions } from '@/utils/githubCalculations';

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
    const debugFlag = searchParams.get('debug') === '1' || process.env.NODE_ENV !== 'production';
    const compactFlag = searchParams.get('compact') === '1';

    const [profileRes, reposRes, contribRes, prevContribRes] = await Promise.all([
      svc.fetchProfile(false),
      svc.fetchRepositories(false, 1, 100),
      svc.fetchContributions(year),
      svc.fetchContributions(year - 1),
    ]);

    if (!profileRes.success || !reposRes.success) {
      const error = profileRes.error || reposRes.error || 'Failed to fetch GitHub data';
      const status = /rate limit/i.test(error || '') ? 429 : 500;
      return json({ success: false, error } as any, { status });
    }

    const profile = profileRes.data!;
    const repos = reposRes.data || [];
    const contributions = contribRes.success && contribRes.data ? contribRes.data : { totalContributions: 0, weeks: [], months: [] } as any;
    const prevContributions = prevContribRes.success && prevContribRes.data ? prevContribRes.data : { totalContributions: 0, weeks: [], months: [] } as any;

    const languages = computeLanguages(repos);
    const stats = computeStats(profile, repos);
    const topRepositories = computeTopRepos(repos);
    const recentActivity = computeRecentActivity(repos);

    const rateLimit = reposRes.rateLimit || profileRes.rateLimit || contribRes.rateLimit;

    // Enhance stats with contribution totals and streaks if available
    let __debug: any = undefined;
    try {
      const currentDays = (contributions?.weeks || []).flatMap((w: any) => w.contributionDays || []);
      const prevDays = (prevContributions?.weeks || []).flatMap((w: any) => w.contributionDays || []);
      // Merge previous year tail with current year for cross-year streaks (last 400 days to be safe)
      // Also exclude future dates beyond today to avoid trailing end-of-year zeros
      const now = new Date(); now.setHours(0,0,0,0);
      const merged = [...prevDays, ...currentDays];
      const filtered = merged.filter((d: any) => {
        const dd = new Date(d.date); dd.setHours(0,0,0,0);
        return dd.getTime() <= now.getTime();
      });
      const days = filtered.slice(-400);
      if (days.length) {
        const totals = calculateTotalContributions(days);
        const { currentStreak, longestStreak } = calculateContributionStreaks(days);

        // Defensive re-computation inline for debug and correctness
        const map = new Map<string, number>();
        for (const d of days) {
          map.set(d.date, d.count);
        }
        const fmt = (date: Date, useLocal = false) => useLocal
          ? `${date.getFullYear().toString().padStart(4,'0')}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`
          : date.toISOString().split('T')[0];
        const computeSafeStreak = () => {
          let s = 0;
          const cursor = new Date();
          cursor.setHours(0,0,0,0);
          // move to yesterday if today missing or zero
          let key = fmt(cursor);
          if (!map.has(key) || (map.get(key) || 0) === 0) {
            cursor.setDate(cursor.getDate()-1);
            key = fmt(cursor);
          }
          // If still missing or zero, streak is 0
          if (!map.has(key) || (map.get(key) || 0) === 0) return 0;
          // Count consecutive >0 backwards
          while (true) {
            const k = fmt(cursor);
            const v = map.get(k);
            if (v && v > 0) {
              s += 1;
              cursor.setDate(cursor.getDate()-1);
            } else {
              break;
            }
          }
          return s;
        };
        let safeCurrentStreak = computeSafeStreak();
        if (safeCurrentStreak === 0) {
          // try local formatting fallback
          const computeSafeStreakLocal = () => {
            let s = 0;
            const cursor = new Date();
            cursor.setHours(0,0,0,0);
            // move to yesterday if today missing or zero
            let key = fmt(cursor, true);
            if (!map.has(key) || (map.get(key) || 0) === 0) {
              cursor.setDate(cursor.getDate()-1);
              key = fmt(cursor, true);
            }
            if (!map.has(key) || (map.get(key) || 0) === 0) return 0;
            while (true) {
              const k = fmt(cursor, true);
              const v = map.get(k);
              if (v && v > 0) {
                s += 1;
                cursor.setDate(cursor.getDate()-1);
              } else {
                break;
              }
            }
            return s;
          };
          safeCurrentStreak = computeSafeStreakLocal();
        }

        // Prefer safe value if it disagrees materially
        const finalCurrentStreak = safeCurrentStreak !== currentStreak ? safeCurrentStreak : currentStreak;

        stats.totalContributions = totals;
        stats.currentStreak = finalCurrentStreak;
        stats.longestStreak = longestStreak;

        if (debugFlag) {
          const last14 = days.slice(-14).map((d: any) => ({ date: d.date, count: d.count }));
          const firstDate = days[0]?.date;
          const lastDate = days[days.length-1]?.date;
          __debug = { last14, firstDate, lastDate, totals, currentStreak, safeCurrentStreak, finalCurrentStreak, longestStreak };
          console.log('[GitHub aggregate debug] last14 days:', last14);
          console.log('[GitHub aggregate debug] totals:', totals, 'currentStreak(util):', currentStreak, 'safeCurrentStreak:', safeCurrentStreak, 'final:', finalCurrentStreak, 'longestStreak:', longestStreak);
        }
      }
    } catch (e) {
      // Keep defaults on failure
      console.warn('Failed to compute contribution streaks/totals:', e);
    }

    const data: GitHubData & { debug?: any } = {
      profile,
      repositories: repos,
      contributions,
      languages,
      stats,
      topRepositories,
      recentActivity,
      ...(debugFlag && __debug ? { debug: __debug } : {}),
    };

    if (compactFlag) {
      const compact = {
        profile: { login: profile.login, created_at: profile.created_at },
        stats,
        debug: (debugFlag && __debug) ? __debug : undefined,
        lastUpdated: new Date().toISOString(),
      };
      
      return json({ success: true, data: compact, cached: false, rateLimit });
    }

    return json<GitHubData>({ success: true, data, cached: !!(profileRes.cached && reposRes.cached), rateLimit });
  } catch (err) {
    console.error('Aggregate GitHub error:', err);
    return json({ success: false, error: 'Internal server error' } as any, { status: 500 });
  }
}

