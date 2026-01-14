"use server";

import { fetchGithubData } from "./github.fetcher";
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

        console.log(`[GitHub Service] ${forceRefresh ? 'Refreshing' : 'Fetching'} stats for ${username}...`);

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

        // 2. Fetch from API
        const rawData = await fetchGithubData(username, headers);

        // 3. Map Data
        const mappedData = mapGithubStats(rawData);

        // 4. Update Cache
        await saveStats(username, mappedData);

        return mappedData;

    } catch (error) {
        console.error(`[GitHub Service] Error for ${username}:`, error);
        return null;
    }
}
