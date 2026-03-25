
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { AuthError, RateLimitError } from "./errors";
import { rateLimit } from "./rateLimit";
import { headers } from "next/headers";

export async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
        throw new AuthError();
    }
    return session;
}

export async function requireRateLimit(key, limit, windowMs) {
    const rl = rateLimit(key, limit, windowMs);
    if (!rl.ok) {
        throw new RateLimitError(rl.resetAt);
    }
    return rl;
}

export async function getClientIp() {
    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    return "unknown";
}
