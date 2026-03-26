import { getContributionDetails } from "@/services/github/github.service";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { getClientIp, requireRateLimit } from "@/lib/guard";

export const GET = withApiHandler(async (request) => {
    const ip = await getClientIp();
    await requireRateLimit(`github-details:${ip}`, 30, 60_000);

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const username = searchParams.get("username") || "GreenHacker420";

    if (!date) {
        throw new Error("Date parameter is required");
    }

    const details = await getContributionDetails(username, date);

    return apiOk({ details });
});
