import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        if (!prisma?.resumeVersion || typeof prisma.resumeVersion !== "object") {
            return NextResponse.json([]);
        }

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
        const code = typeof error?.code === "string" ? error.code : "";
        const message = String(error?.message || "").toLowerCase();
        if (code === "P2021" || code === "P2022" || message.includes("resume_versions")) {
            return NextResponse.json([]);
        }
        return NextResponse.json({ error: "Failed to fetch versions", details: error.message }, { status: 500 });
    }
}
