import { getGithubStats } from '@/services/github/github.service';
import { revalidatePath } from 'next/cache';
import { withApiHandler, apiOk } from '@/lib/apiResponse';
import { getClientIp, requireRateLimit } from '@/lib/guard';

export const POST = withApiHandler(async (request) => {
    const ip = await getClientIp();
    await requireRateLimit(`github-refresh:${ip}`, 5, 60_000);

    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || "GreenHacker420";

    console.log(`[API] Refreshing GitHub stats for ${username}...`);
    await getGithubStats(username, true); // true = force refresh

    // Revalidate the homepage to ensure static pages get the fresh data
    revalidatePath('/');

    return apiOk({ message: "Stats refreshed successfully" });
});
