import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { updateResumeAndCreateVersion } from "@/lib/resume/versioning";
import { ensureStructuredResume } from "@/lib/resume/structured";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const resume = await prisma.resume.findUnique({
            where: { id }
        });

        if (!resume) {
            return NextResponse.json({ error: "Resume not found" }, { status: 404 });
        }

        return NextResponse.json(resume);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch resume" }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { title, latex, isDefault, source, structured } = body;
        const cleanTitle = typeof title === "string" ? title.trim() : "";
        const cleanLatex = typeof latex === "string" && latex.trim() ? latex : "% New Resume";

        if (!cleanTitle) {
            return NextResponse.json({ error: "title is required" }, { status: 400 });
        }

        const resume = await updateResumeAndCreateVersion({
            id,
            title: cleanTitle,
            latex: cleanLatex,
            isDefault: !!isDefault,
            source: source || "manual",
            structured: ensureStructuredResume({ latex: cleanLatex, structured }),
        });

        return NextResponse.json(resume);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update resume", details: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        await prisma.resume.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 });
    }
}
