import { ingestOsintLeads } from "@/actions/leads";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const result = await ingestOsintLeads();
        return NextResponse.json({ success: true, ...result });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
