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
    const [sessions, pageviews, events] = await Promise.all([
        prisma.analyticsSession.count({ where: { startedAt: { gte: since } } }),
        prisma.analyticsEvent.count({ where: { type: "pageview", createdAt: { gte: since } } }),
        prisma.analyticsEvent.groupBy({
            by: ["type"],
            where: { createdAt: { gte: since } },
            _count: { type: true }
        })
    ]);

    return {
        sessions,
        pageviews,
        events: events.map(e => ({ type: e.type, count: e._count.type }))
    };
}
