import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const leads = await prisma.jobLead.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
        include: { source: true }
    });
    return NextResponse.json(leads);
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { title, company, sourceName = "manual", url, description, location, remote, tags } = body;

        const source = await prisma.jobSource.upsert({
            where: { name: sourceName },
            update: { updatedAt: new Date() },
            create: { name: sourceName, kind: "manual" }
        });

        const lead = await prisma.jobLead.create({
            data: {
                title,
                company,
                url,
                description,
                location,
                remote: !!remote,
                tags: tags ? JSON.stringify(tags) : null,
                sourceId: source.id
            }
        });

        return NextResponse.json(lead);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
