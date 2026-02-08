import { processFollowups } from "@/lib/scheduler/followups";
import { NextResponse } from "next/server";

export async function POST() {
    const result = await processFollowups();
    return NextResponse.json(result);
}
