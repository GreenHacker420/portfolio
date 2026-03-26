
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { getClientIp, requireRateLimit } from "@/lib/guard";
import crypto from "crypto";
import { 
    upsertAnalyticsSession, 
    createAnalyticsEvents 
} from "@/repositories/analytics.repository";

function hashIp(ip) {
    if (!ip) return null;
    return crypto.createHash("sha256").update(ip + (process.env.ANALYTICS_SALT || "")).digest("hex");
}

function pickGeo(request) {
    const country = request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry") || null;
    const city = request.headers.get("x-vercel-ip-city") || null;
    return { country, city };
}

export const POST = withApiHandler(async (req) => {
    const ip = await getClientIp();
    await requireRateLimit(`collect:${ip}`, 30, 60_000);

    const payload = await req.json();
    const { sessionId, events, referrer, utm, device, userAgent } = payload || {};
    if (!Array.isArray(events) || events.length === 0) {
        throw new Error("No events");
    }

    const { country, city } = pickGeo(req);
    const session = await upsertAnalyticsSession({
        id: sessionId || crypto.randomUUID(),
        country,
        city,
        referrer: referrer?.slice(0, 300) || null,
        utmSource: utm?.source || null,
        utmMedium: utm?.medium || null,
        utmCampaign: utm?.campaign || null,
        device: device || null,
        userAgent: userAgent?.slice(0, 300) || null,
        hashedIp: hashIp(ip),
    });

    const safeEvents = events.slice(0, 100).map((evt) => ({
        sessionId: session.id,
        type: evt.type,
        page: evt.page?.slice(0, 200) || null,
        ctaId: evt.ctaId?.slice(0, 120) || null,
        scrollPct: typeof evt.scrollPct === "number" ? Math.round(evt.scrollPct) : null,
        durationMs: typeof evt.durationMs === "number" ? Math.round(evt.durationMs) : null,
        meta: evt.meta ? JSON.parse(JSON.stringify(evt.meta)) : undefined
    }));

    await createAnalyticsEvents(safeEvents);

    return apiOk({ ok: true, sessionId: session.id });
});
