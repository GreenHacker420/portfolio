import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { subDays } from "date-fns";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const days = Number(searchParams.get("days") || 7);
    const since = subDays(new Date(), days);

    const sessions = await prisma.analyticsSession.findMany({
        where: { startedAt: { gte: since } },
        select: { id: true, startedAt: true, country: true, city: true, referrer: true, utmSource: true, utmCampaign: true }
    });
    const events = await prisma.analyticsEvent.findMany({
        where: { createdAt: { gte: since } },
        select: { type: true, page: true, ctaId: true, scrollPct: true, durationMs: true, createdAt: true, sessionId: true }
    });

    const rows = [
        "kind,id,timestamp,country,city,referrer,utm_source,utm_campaign,page,type,cta_id,scroll_pct,duration_ms"
    ];

    for (const s of sessions) {
        rows.push(`session,${s.id},${s.startedAt.toISOString()},${s.country || ""},${s.city || ""},${s.referrer || ""},${s.utmSource || ""},${s.utmCampaign || ""},,,,`);
    }
    for (const e of events) {
        rows.push(`event,${e.sessionId || ""},${e.createdAt.toISOString()},,,,,${e.page || ""},${e.type},${e.ctaId || ""},${e.scrollPct || ""},${e.durationMs || ""}`);
    }

    const csv = rows.join("\n");
    return new NextResponse(csv, {
        status: 200,
        headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="analytics-${days}d.csv"`
        }
    });
}
