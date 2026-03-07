import { NextResponse } from 'next/server';
import { getGithubStats } from '@/services/github/github.service';
import { revalidatePath } from 'next/cache';

export async function POST(request) {
    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username') || "GreenHacker420";

        console.log(`[API] Refreshing GitHub stats for ${username}...`);
        await getGithubStats(username, true); // true = force refresh

        // Revalidate the homepage to ensure static pages get the fresh data
        revalidatePath('/');

        return NextResponse.json({ success: true, message: "Stats refreshed successfully" });
    } catch (error) {
        console.error("[API] Refresh Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
