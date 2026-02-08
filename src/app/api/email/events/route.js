import { logEmailEvent } from "@/lib/mail.events";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { type, campaignId, applicationId, toAddress, metadata } = body;
        if (!type) return NextResponse.json({ error: "type required" }, { status: 400 });
        await logEmailEvent({ campaignId, applicationId, toAddress, type, metadata });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
