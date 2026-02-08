'use server';

import prisma from "@/lib/db";
import { startOfDay, subDays } from "date-fns";

// Simple daily rollup for sessions and pageviews; extendable.
export async function rollupAnalytics(days = 1) {
    const today = startOfDay(new Date());
    const from = subDays(today, days);

    const sessions = await prisma.analyticsSession.count({
        where: { startedAt: { gte: from, lt: today } }
    });

    const pageviews = await prisma.analyticsEvent.count({
        where: {
            type: "pageview",
            createdAt: { gte: from, lt: today }
        }
    });

    await prisma.analyticsRollup.createMany({
        data: [
            { date: today, metric: "sessions", value: sessions },
            { date: today, metric: "pageviews", value: pageviews }
        ]
    });

    return { sessions, pageviews };
}

export async function getAnalyticsSummary(rangeDays = 7) {
    const since = subDays(new Date(), rangeDays);
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

    return {
        sessions,
        pageviews,
        events: events.map(e => ({ type: e.type, count: e._count.type })),
        referrers: referrers.map(r => ({ referrer: r.referrer, count: r._count.referrer })),
        utm: utm.map(u => ({ source: u.utmSource, campaign: u.utmCampaign, count: u._count._all })),
        geo: geo.map(g => ({ country: g.country, city: g.city, count: g._count._all })),
        scrollAvg: scroll._avg.scrollPct || 0,
        timeOnPageMs: timeOnPage._avg.durationMs || 0
    };
}
