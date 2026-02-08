import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
    try {
        const { id } = params;
        const body = await req.json();
        const { followupAt } = body;
        const app = await prisma.application.update({
            where: { id },
            data: { followupAt: followupAt ? new Date(followupAt) : null }
        });
        await prisma.applicationEvent.create({
            data: { applicationId: id, type: "followup_scheduled", payload: { followupAt } }
        });
        return NextResponse.json(app);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
