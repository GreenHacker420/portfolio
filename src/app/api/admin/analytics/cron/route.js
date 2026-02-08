import { rollupAnalytics } from "@/actions/analytics";
import { NextResponse } from "next/server";

// For hosting provider cron hooks
export async function GET() {
    const result = await rollupAnalytics(1);
    return NextResponse.json({ success: true, ...result });
}
