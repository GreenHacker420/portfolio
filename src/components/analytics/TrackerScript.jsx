"use client";

import { useEffect, useRef } from "react";

const COLLECT_ENDPOINT = "/api/collect";

function buildPayload(events, sessionIdRef) {
    return {
        sessionId: sessionIdRef.current,
        referrer: document.referrer || undefined,
        utm: Object.fromEntries(new URLSearchParams(window.location.search).entries()),
        device: navigator.userAgentData?.platform || navigator.platform,
        userAgent: navigator.userAgent,
        events
    };
}

export default function TrackerScript() {
    const sessionIdRef = useRef(
        typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
    );
    const queueRef = useRef([]);
    const flushTimer = useRef(null);

    useEffect(() => {
        if (window.location.pathname.startsWith("/admin")) return;

        const enqueue = (evt) => {
            queueRef.current.push({ ...evt, ts: Date.now() });
            if (!flushTimer.current) {
                flushTimer.current = setTimeout(flush, 2000);
            }
        };

        const flush = () => {
            if (queueRef.current.length === 0) {
                flushTimer.current = null;
                return;
            }
            const batch = queueRef.current.splice(0, queueRef.current.length);
            const payload = buildPayload(batch, sessionIdRef);
            const body = JSON.stringify(payload);
            navigator.sendBeacon?.(COLLECT_ENDPOINT, body) ||
                fetch(COLLECT_ENDPOINT, { method: "POST", body, headers: { "Content-Type": "application/json" } });
            flushTimer.current = null;
        };

        // Pageview
        enqueue({ type: "pageview", page: window.location.pathname });

        // Scroll depth
        let maxScroll = 0;
        const onScroll = () => {
            const pct = Math.round(
                (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
            );
            if (pct > maxScroll) {
                maxScroll = pct;
                enqueue({ type: "scroll", page: window.location.pathname, scrollPct: Math.min(100, maxScroll) });
            }
        };
        window.addEventListener("scroll", onScroll, { passive: true });

        // Time on page
        const start = performance.now();
        const onBeforeUnload = () => {
            enqueue({
                type: "time_on_page",
                page: window.location.pathname,
                durationMs: Math.round(performance.now() - start)
            });
            flush();
        };
        window.addEventListener("beforeunload", onBeforeUnload);
        window.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                onBeforeUnload();
            }
        });

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("beforeunload", onBeforeUnload);
        };
    }, []);

    return null;
}
