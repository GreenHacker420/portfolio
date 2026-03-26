import { getGithubStats } from "@/services/github/github.service";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { getClientIp, requireRateLimit } from "@/lib/guard";

export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (req) => {
    const ip = await getClientIp();
    await requireRateLimit(`github:${ip}`, 20, 60_000);

    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
        throw new Error("Username is required");
    }

    const data = await getGithubStats(username);

    if (!data) {
        throw new Error("Failed to fetch GitHub data");
    }

    const response = apiOk(data);
    response.headers.set("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=3600");
    return response;
});
