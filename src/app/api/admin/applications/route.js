
import { getAllApplications } from "@/repositories/application.repository";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const applications = await getAllApplications();
        return NextResponse.json(applications);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
