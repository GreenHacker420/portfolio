import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { createResumeWithInitialVersion } from "@/lib/resume/versioning";
import { ensureStructuredResume } from "@/lib/resume/structured";

export async function GET() {
    try {
        const resumes = await prisma.resume.findMany({
            orderBy: { updatedAt: "desc" }
        });

        // Some environments can fail on relation counts; compute defensively.
        let versionCountsByResumeId = {};
        if (prisma?.resumeVersion && typeof prisma.resumeVersion === "object") {
            try {
                const grouped = await prisma.resumeVersion.groupBy({
                    by: ["resumeId"],
                    _count: { _all: true }
                });
                versionCountsByResumeId = Object.fromEntries(
                    grouped.map((row) => [row.resumeId, Number(row._count?._all || 0)])
                );
            } catch {
                versionCountsByResumeId = {};
            }
        }

        const payload = resumes.map((resume) => ({
            ...resume,
            _count: {
                versions: Number(versionCountsByResumeId[resume.id] || 0)
            }
        }));

        return NextResponse.json(payload);
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
        console.error("[Resume Create Error]", error);
        return NextResponse.json({ error: "Failed to create resume", details: error.message }, { status: 500 });
    }
}
