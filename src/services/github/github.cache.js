"use server";

import prisma from "@/lib/db";

const ONE_DAY = 24 * 60 * 60 * 1000;

/**
 * Retrieves cached stats if they exist and are fresh (less than 24 hours old).
 * @param {string} username 
 * @returns {Promise<any|null>} Cached data or null
 */
export async function getCachedStats(username) {
    try {
        if (!prisma) {
            console.error("Prisma client is undefined in github.cache.js");
            return null;
        }

        // Debug availability (temporary)
        if (!prisma.githubStats) {
             console.error("prisma.githubStats is undefined. Keys:", Object.keys(prisma));
             return null;
        }

        const cached = await prisma.githubStats.findUnique({
            where: { username }
        });

        if (!cached) return null;

        const isFresh = (Date.now() - new Date(cached.fetchedAt).getTime()) < ONE_DAY;

        if (isFresh) {
            console.log(`[Cache Hit] Serving fresh stats for ${username}`);
            return cached.data;
        }

        console.log(`[Cache Stale] Data for ${username} is older than 24h`);
        return null;
    } catch (error) {
        console.error("Cache read error:", error);
        return null; // Fail safe
    }
}

/**
 * Saves or updates GitHub stats in the database.
 * @param {string} username 
 * @param {any} data 
 */
export async function saveStats(username, data) {
    try {
        if (!prisma.githubStats) return;

        await prisma.githubStats.upsert({
            where: { username },
            update: {
                data,
                fetchedAt: new Date()
            },
            create: {
                username,
                data,
                fetchedAt: new Date()
            }
        });
        console.log(`[Cache Update] Saved stats for ${username}`);
    } catch (error) {
        console.error("Cache save error:", error);
    }
}
