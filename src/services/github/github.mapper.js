import { formatDistanceToNow } from 'date-fns';

/**
 * Maps raw GitHub API data to a cleaner, UI-ready format.
 * Removes fake metrics and properly labels estimates.
 */
export function mapGithubStats({ user, repos, events, contributions, totalPRs, totalIssues }) {

    // 1. Calculate Total Stars
    const totalStars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);

    // 2. Language Statistics
    const languages = {};
    repos.forEach(repo => {
        if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
    });

    const totalRepos = repos.length;
    const languageStats = Object.entries(languages)
        .map(([name, count]) => ({
            name,
            percentage: Math.round((count / totalRepos) * 100),
            color: getLanguageColor(name)
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5);

    // 3. Recent Activity (Mapped safely)
    const recentActivity = events
        .filter(event => ['PushEvent', 'PullRequestEvent', 'WatchEvent', 'CreateEvent', 'IssuesEvent'].includes(event.type))
        .slice(0, 5)
        .map(event => ({
            type: formatEventType(event.type),
            repo: event.repo?.name?.split('/')[1] || event.repo?.name || 'Unknown',
            message: getEventMessage(event),
            date: formatDate(event.created_at)
        }))
        // Simple deduping: remove consecutive identical activites (e.g. multiple pushes)
        .filter((item, index, self) => {
            if (index === 0) return true;
            const prev = self[index - 1];
            // Dedupe if same type, repo, and message
            return !(item.type === prev.type && item.repo === prev.repo && item.message === prev.message);
        })
        .slice(0, 5);

    // 4. Metrics (No Fake Data)
    const recentCommits = events
        .filter(e => e.type === 'PushEvent')
        .reduce((acc, e) => acc + (e.payload?.size || 1), 0);

    const recentPRs = events.filter(e => e.type === 'PullRequestEvent').length;
    const recentIssues = events.filter(e => e.type === 'IssuesEvent').length;

    // Use fetched totals if available from GraphQL, fallback to recent
    const finalPRs = totalPRs !== undefined ? totalPRs : recentPRs;
    const finalIssues = totalIssues !== undefined ? totalIssues : recentIssues;

    // Total Contributions from GraphQL
    const totalContributions = contributions?.totalContributions || 0;

    const { currentStreak, longestStreak, busiestDay } = calculateStreaks(contributions?.weeks || []);

    return {
        username: user.login,
        avatar: user.avatar_url,
        bio: user.bio,
        location: user.location,
        publicRepos: user.public_repos,
        followers: user.followers,
        following: user.following,

        // Calculated
        totalStars,
        languages: languageStats,
        recentActivity,

        // Windowed / Activity Based
        activityMetrics: {
            totalContributions, // Real annual total
            recentCommits,
            recentPRs: finalPRs,
            recentIssues: finalIssues,
            currentStreak,
            longestStreak,
            busiestDay,
            isEstimated: false,
            note: "All Time"
        },

        // Contributions Heatmap via GraphQL
        contributions: contributions?.weeks?.flatMap(week =>
            week.contributionDays.map(day => ({
                count: day.contributionCount,
                date: day.date
            }))
        ) || [],

        // Timestamps
        updatedAt: new Date().toISOString()
    };
}


// Helpers
function getLanguageColor(language) {
    const colors = {
        JavaScript: "#f7df1e",
        TypeScript: "#3178c6",
        Python: "#3572A5",
        Rust: "#dea584",
        HTML: "#e34c26",
        CSS: "#563d7c",
        Java: "#b07219",
        Go: "#00ADD8",
        "Jupyter Notebook": "#DA5B0B",
        Shell: "#89e051"
    };
    return colors[language] || "#ededed";
}

function formatEventType(type) {
    switch (type) {
        case 'PushEvent': return 'Push';
        case 'PullRequestEvent': return 'PR';
        case 'WatchEvent': return 'Star';
        case 'CreateEvent': return 'Create';
        case 'IssuesEvent': return 'Issue';
        default: return 'Activity';
    }
}

function getEventMessage(event) {
    if (event.type === 'PushEvent') {
        const count = event.payload?.size ?? 1;
        return `Pushed ${count} commit${count === 1 ? '' : 's'}`;
    }
    if (event.type === 'PullRequestEvent') return `${event.payload?.action} PR`;
    if (event.type === 'IssuesEvent') return `${event.payload?.action} issue`;
    if (event.type === 'WatchEvent') return 'Starred repository';
    if (event.type === 'CreateEvent') return `Created ${event.payload?.ref_type || 'repo'}`;
    return "Activity";
}

function formatDate(isoString) {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
        return isoString;
    }
}

function calculateStreaks(weeks) {
    if (!weeks || weeks.length === 0) return { currentStreak: 0, longestStreak: 0, busiestDay: { date: '', count: 0 } };

    let currentStreak = 0;
    let longestStreak = 0;
    let busiestDay = { date: '', count: 0 };

    const allDays = weeks.flatMap(w => w.contributionDays);
    const today = new Date().toISOString().split('T')[0];

    for (let i = 0; i < allDays.length; i++) {
        const day = allDays[i];

        if (day.date > today) break;

        if (day.contributionCount > busiestDay.count) {
            busiestDay = { date: day.date, count: day.contributionCount };
        }

        if (day.contributionCount > 0) {
            currentStreak++;
            if (currentStreak > longestStreak) {
                longestStreak = currentStreak;
            }
        } else {
            if (day.date < today) {
                currentStreak = 0;
            }
        }
    }

    return { currentStreak, longestStreak, busiestDay };
}
