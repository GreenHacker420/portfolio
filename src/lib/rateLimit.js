// Simple in-memory rate limiter (per-process).
// Not perfect for multi-instance deployments but good enough for basic abuse protection.
const buckets = new Map();

/**
 * Consume one token from the bucket for the given key.
 * @param {string} key unique identifier (e.g., IP or session id)
 * @param {number} limit max requests per window
 * @param {number} windowMs window size in ms
 * @returns {{ok: boolean, remaining: number, resetAt: number}}
 */
export function rateLimit(key, limit = 20, windowMs = 60_000) {
    const now = Date.now();
    const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > bucket.resetAt) {
        bucket.count = 0;
        bucket.resetAt = now + windowMs;
    }

    bucket.count += 1;
    buckets.set(key, bucket);

    return {
        ok: bucket.count <= limit,
        remaining: Math.max(0, limit - bucket.count),
        resetAt: bucket.resetAt
    };
}

export function rateLimitResponse(res, info) {
    if (!res?.headers) return;
    res.headers.set("X-RateLimit-Remaining", String(info.remaining));
    res.headers.set("X-RateLimit-Reset", String(info.resetAt));
}
