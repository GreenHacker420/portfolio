
'use server';

import { startOfDay, subDays } from "date-fns";
import { withErrorHandler } from "@/lib/response";
import { requireAdmin } from "@/lib/guard";
import { 
    getAnalyticsSummaryData, 
    createAnalyticsRollups, 
    countSessions, 
    countEvents 
} from "@/repositories/analytics.repository";

export async function rollupAnalytics(days = 1) {
    return withErrorHandler(async () => {
        await requireAdmin();
        const today = startOfDay(new Date());
        const from = subDays(today, days);

        const sessions = await countSessions({ startedAt: { gte: from, lt: today } });
        const pageviews = await countEvents({
            type: "pageview",
            createdAt: { gte: from, lt: today }
        });

        await createAnalyticsRollups([
            { date: today, metric: "sessions", value: sessions },
            { date: today, metric: "pageviews", value: pageviews }
        ]);

        return { sessions, pageviews };
    });
}

export async function getAnalyticsSummary(rangeDays = 7) {
    return withErrorHandler(async () => {
        await requireAdmin();
        const since = subDays(new Date(), rangeDays);
        const raw = await getAnalyticsSummaryData(since);

        return {
            sessions: raw.sessions,
            pageviews: raw.pageviews,
            events: raw.events.map(e => ({ type: e.type, count: e._count.type })),
            referrers: raw.referrers.map(r => ({ referrer: r.referrer, count: r._count.referrer })),
            utm: raw.utm.map(u => ({ source: u.utmSource, campaign: u.utmCampaign, count: u._count._all })),
            geo: raw.geo.map(g => ({ country: g.country, city: g.city, count: g._count._all })),
            scrollAvg: raw.scroll._avg.scrollPct || 0,
            timeOnPageMs: raw.timeOnPage._avg.durationMs || 0
        };
    });
}
