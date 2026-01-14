import { getGithubStats } from "@/services/github/github.service";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
        return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    try {
        const data = await getGithubStats(username);

        if (!data) {
            return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
