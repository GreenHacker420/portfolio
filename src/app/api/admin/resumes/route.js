import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { createResumeWithInitialVersion } from "@/lib/resume/versioning";
import { ensureStructuredResume } from "@/lib/resume/structured";

export async function GET() {
    try {
        const resumes = await prisma.resume.findMany({
            orderBy: { updatedAt: 'desc' },
            include: {
                _count: {
                    select: { versions: true }
                }
            }
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
        const { title, latex, structured } = body;
        const cleanTitle = typeof title === "string" ? title.trim() : "";
        const cleanLatex = typeof latex === "string" && latex.trim() ? latex : "% New Resume";

        if (!cleanTitle) {
            return NextResponse.json({ error: "title is required" }, { status: 400 });
        }

        const resume = await createResumeWithInitialVersion({
            title: cleanTitle,
            latex: cleanLatex,
            structured: ensureStructuredResume({ latex: cleanLatex, structured }),
            source: "create"
        });

        return NextResponse.json(resume);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create resume", details: error.message }, { status: 500 });
    }
}
