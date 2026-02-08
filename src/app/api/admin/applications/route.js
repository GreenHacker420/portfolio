import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const apps = await prisma.application.findMany({
        orderBy: { createdAt: "desc" },
        include: { lead: true, recruiter: true, events: true }
    });
    return NextResponse.json(apps);
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { leadId, recruiterEmail, status = "queued", notes } = body;

        let recruiterId = null;
        if (recruiterEmail) {
            const recruiter = await prisma.recruiterContact.upsert({
                where: { email: recruiterEmail },
                update: { updatedAt: new Date() },
                create: { email: recruiterEmail }
            });
            recruiterId = recruiter.id;
        }

        const app = await prisma.application.create({
            data: {
                leadId,
                recruiterId,
                status,
                notes
            }
        });

        await prisma.applicationEvent.create({
            data: { applicationId: app.id, type: "created" }
        });

        return NextResponse.json(app);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
