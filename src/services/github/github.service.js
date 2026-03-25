
import { fetchGithubData, fetchContributionDetails } from "./github.fetcher";
import { getCachedStats, saveStats } from "./github.cache";
import { mapGithubStats } from "./github.mapper";

function buildGithubHeaders() {
    return {
        Accept: "application/vnd.github+json",
        ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
        })
    };
}

export async function getGithubStats(username, forceRefresh = false) {
    if (!username) return null;

    try {
        if (!forceRefresh) {
            const cached = await getCachedStats(username);
            if (cached) return cached;
        }

        const headers = buildGithubHeaders();
        const rawData = await fetchGithubData(username, headers, forceRefresh);
        const mappedData = mapGithubStats(rawData);

        await saveStats(username, mappedData);
        return mappedData;
    } catch (error) {
        console.error(`[GitHub Service] Error for ${username}:`, error);
        return null;
    }
}

export async function getContributionDetails(username, date) {
    if (!username || !date) return [];
    try {
        const headers = buildGithubHeaders();
        return await fetchContributionDetails(username, date, headers);
    } catch (error) {
        console.error(`[GitHub Service] Error fetching details for ${username} on ${date}:`, error);
        return [];
    }
}
