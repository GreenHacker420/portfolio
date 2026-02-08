import { rollupAnalytics } from "@/actions/analytics";
import { NextResponse } from "next/server";

// Intended to be called by cron/automation
export async function POST() {
    const result = await rollupAnalytics(1);
    return NextResponse.json({ success: true, ...result });
}
