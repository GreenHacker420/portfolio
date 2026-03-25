
import prisma from "@/lib/db";

export async function getAnalyticsSummaryData(since) {
    const [sessions, pageviews, events, referrers, utm, geo, scroll, timeOnPage] = await Promise.all([
        prisma.analyticsSession.count({ where: { startedAt: { gte: since } } }),
        prisma.analyticsEvent.count({ where: { type: "pageview", createdAt: { gte: since } } }),
        prisma.analyticsEvent.groupBy({
            by: ["type"],
            where: { createdAt: { gte: since } },
            _count: { type: true }
        }),
        prisma.analyticsSession.groupBy({
            by: ["referrer"],
            where: { referrer: { not: null }, startedAt: { gte: since } },
            _count: { referrer: true },
            orderBy: { _count: { referrer: "desc" } },
            take: 5
        }),
        prisma.analyticsSession.groupBy({
            by: ["utmSource", "utmCampaign"],
            where: { utmSource: { not: null }, startedAt: { gte: since } },
            _count: { _all: true },
            orderBy: { _count: { _all: "desc" } },
            take: 5
        }),
        prisma.analyticsSession.groupBy({
            by: ["country", "city"],
            where: { country: { not: null }, startedAt: { gte: since } },
            _count: { _all: true },
            orderBy: { _count: { _all: "desc" } },
            take: 5
        }),
        prisma.analyticsEvent.aggregate({
            _avg: { scrollPct: true },
            where: { type: "scroll", createdAt: { gte: since } }
        }),
        prisma.analyticsEvent.aggregate({
            _avg: { durationMs: true },
            where: { type: "time_on_page", createdAt: { gte: since } }
        })
    ]);

    return { sessions, pageviews, events, referrers, utm, geo, scroll, timeOnPage };
}

export async function createAnalyticsRollups(data) {
    return prisma.analyticsRollup.createMany({ data });
}

export async function countSessions(where) {
    return prisma.analyticsSession.count({ where });
}

export async function countEvents(where) {
    return prisma.analyticsEvent.count({ where });
}

export async function upsertAnalyticsSession(data) {
    const { id, ...rest } = data;
    return prisma.analyticsSession.upsert({
        where: { id: id || "temp" },
        update: {
            ...rest,
            lastSeenAt: new Date(),
        },
        create: {
            ...data,
            id: id || crypto.randomUUID(),
        }
    });
}

export async function createAnalyticsEvents(data) {
    return prisma.analyticsEvent.createMany({ data });
}
