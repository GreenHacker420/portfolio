import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const limit = Number(searchParams.get("limit") || 20);

        const versions = await prisma.resumeVersion.findMany({
            where: { resumeId: id },
            orderBy: { createdAt: "desc" },
            take: Number.isNaN(limit) ? 20 : Math.min(Math.max(limit, 1), 100),
            select: {
                id: true,
                title: true,
                source: true,
                createdAt: true,
            }
        });

        return NextResponse.json(versions);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch versions", details: error.message }, { status: 500 });
    }
}
