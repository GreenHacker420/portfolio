
import prisma from "@/lib/db";

const ONE_DAY = 24 * 60 * 60 * 1000;

export async function getCachedStats(username) {
    try {
        const cached = await prisma.githubStats.findUnique({
            where: { username }
        });

        if (!cached) return null;

        const isFresh = (Date.now() - new Date(cached.fetchedAt).getTime()) < ONE_DAY;
        if (isFresh) return cached.data;
        return null;
    } catch (error) {
        console.error("Cache read error:", error);
        return null;
    }
}

export async function saveStats(username, data) {
    try {
        await prisma.githubStats.upsert({
            where: { username },
            update: { data, fetchedAt: new Date() },
            create: { username, data, fetchedAt: new Date() }
        });
    } catch (error) {
        console.error("Cache save error:", error);
    }
}
