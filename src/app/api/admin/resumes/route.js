import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const resumes = await prisma.resume.findMany({
            orderBy: { updatedAt: 'desc' }
        });
        return NextResponse.json(resumes);
    } catch (error) {
        console.error("[Resume API Error]", error);
        return NextResponse.json({ error: "Failed to fetch resumes", details: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { title, latex } = body;

        const resume = await prisma.resume.create({
            data: {
                title,
                latex: latex || "% New Resume",
                isDefault: false
            }
        });

        return NextResponse.json(resume);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create resume" }, { status: 500 });
    }
}
