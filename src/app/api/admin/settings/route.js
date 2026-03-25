
import { getSettings, upsertSettings } from "@/repositories/settings.repository";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const settings = await getSettings();
        return NextResponse.json(settings);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const settings = await req.json();
        if (!Array.isArray(settings)) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        await upsertSettings(settings);
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
