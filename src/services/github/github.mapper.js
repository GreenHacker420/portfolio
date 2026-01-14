import { formatDistanceToNow } from 'date-fns';

/**
 * Maps raw GitHub API data to a cleaner, UI-ready format.
 * Removes fake metrics and properly labels estimates.
 */
export function mapGithubStats({ user, repos, events, contributions }) {

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

    // Total Contributions from GraphQL
    const totalContributions = contributions?.totalContributions || 0;

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
            recentPRs,
            recentIssues,
            isEstimated: false,
            note: "Last Year"
        },

        // Contributions Heatmap via GraphQL
        contributions: contributions?.weeks?.flatMap(week =>
            week.contributionDays.map(day => Math.min(day.contributionCount, 4))
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
