"use server";

export const runtime = "edge";

import { rateLimit, rateLimitResponse } from "@/lib/rateLimit";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";

function hashIp(ip) {
    if (!ip) return null;
    return crypto.createHash("sha256").update(ip + process.env.ANALYTICS_SALT || "").digest("hex");
}

function pickGeo(request) {
    // Rely on standard headers; keep coarse only.
    const country = request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry") || null;
    const city = request.headers.get("x-vercel-ip-city") || null;
    return { country, city };
}

export async function POST(req) {
    try {
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
        const rl = rateLimit(`collect:${ip}`, 60, 60_000);
        if (!rl.ok) {
            const res = NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
            rateLimitResponse(res, rl);
            return res;
        }

        const payload = await req.json();
        const { sessionId, events, referrer, utm, device, userAgent } = payload || {};
        if (!Array.isArray(events) || events.length === 0) {
            return NextResponse.json({ error: "No events" }, { status: 400 });
        }

        // Upsert session (bounded writes)
        const { country, city } = pickGeo(req);
        const session = await prisma.analyticsSession.upsert({
            where: { id: sessionId || "temp" },
            update: {
                lastSeenAt: new Date(),
                country,
                city,
                referrer: referrer?.slice(0, 300) || null,
                utmSource: utm?.source || null,
                utmMedium: utm?.medium || null,
                utmCampaign: utm?.campaign || null,
                device: device || null,
                userAgent: userAgent?.slice(0, 300) || null,
                hashedIp: hashIp(ip),
            },
            create: {
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
            }
        });

        // Create events (truncate meta to safe size)
        const safeEvents = events.slice(0, 100).map((evt) => ({
            sessionId: session.id,
            type: evt.type,
            page: evt.page?.slice(0, 200) || null,
            ctaId: evt.ctaId?.slice(0, 120) || null,
            scrollPct: typeof evt.scrollPct === "number" ? Math.round(evt.scrollPct) : null,
            durationMs: typeof evt.durationMs === "number" ? Math.round(evt.durationMs) : null,
            meta: evt.meta ? JSON.parse(JSON.stringify(evt.meta)) : undefined
        }));

        await prisma.analyticsEvent.createMany({ data: safeEvents });

        const res = NextResponse.json({ ok: true, sessionId: session.id });
        rateLimitResponse(res, rl);
        return res;
    } catch (error) {
        console.error("[collect] error", error);
        return NextResponse.json({ error: "collect_failed" }, { status: 500 });
    }
}
