"use server";

import { fetchGithubData, fetchContributionDetails } from "./github.fetcher";
import { getCachedStats, saveStats } from "./github.cache";
import { mapGithubStats } from "./github.mapper";

/**
 * Main Service function to get GitHub Stats.
 * Orchestrates Cache, Fetcher, and Mapper layers.
 * 
 * @param {string} username 
 * @returns {Promise<any>} Mapped GitHub Data
 */
export async function getGithubStats(username, forceRefresh = false) {
    if (!username) return null;

    try {
        // 1. Try Cache first (if not forcing refresh)
        if (!forceRefresh) {
            const cached = await getCachedStats(username);
            if (cached) return cached;
        }

        console.log(`[GitHub Service] ${forceRefresh ? 'FORCE REFRESHING' : 'Fetching'} stats for ${username}...`);

        // Prepare Headers - Important for GraphQL to work!
        const headers = {
            Accept: "application/vnd.github+json",
            ...(process.env.GITHUB_TOKEN && {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
            })
        };

        if (!process.env.GITHUB_TOKEN) {
            console.warn("[GitHub Service] WARNING: No GITHUB_TOKEN found in environment. GraphQL queries will likely fail.");
        }

        // 2. Fetch from API (forceRefresh = cache: 'no-store')
        const rawData = await fetchGithubData(username, headers, forceRefresh);

        // 3. Map Data
        const mappedData = mapGithubStats(rawData);

        // Debug: log contribution date range
        const contribs = mappedData?.contributions || [];
        if (contribs.length > 0) {
            console.log(`[GitHub Service] Contributions range: ${contribs[0].date} → ${contribs[contribs.length - 1].date} (${contribs.length} days)`);
        }

        // 4. Update Cache
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
        const headers = {
            Accept: "application/vnd.github+json",
            ...(process.env.GITHUB_TOKEN && {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
            })
        };

        return await fetchContributionDetails(username, date, headers);
    } catch (error) {
        console.error(`[GitHub Service] Error fetching details for ${username} on ${date}:`, error);
        return [];
    }
}
