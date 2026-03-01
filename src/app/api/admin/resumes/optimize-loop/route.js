import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { ensureStructuredResume } from "@/lib/resume/structured";
import { updateResumeAndCreateVersion } from "@/lib/resume/versioning";
import { buildResumeOptimizationLoop } from "@/lib/langgraph/resume-optimize-loop";
import { DEFAULT_MODEL_ID } from "@/lib/ai/models";
import { getPublicResumePdfContext } from "@/lib/resume/pdf-context";

export async function POST(req) {
    try {
        const {
            resumeId,
            jdText,
            tone = "concise",
            targetScore = 8.8,
            maxIterations = 3,
            writerModelId = DEFAULT_MODEL_ID,
            reviewerModelId = DEFAULT_MODEL_ID,
            humanizerModelId = DEFAULT_MODEL_ID,
        } = await req.json();

        if (!resumeId || !jdText) {
            return NextResponse.json({ error: "resumeId and jdText are required" }, { status: 400 });
        }

        const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
        if (!resume) {
            return NextResponse.json({ error: "resume not found" }, { status: 404 });
        }
        const pdfContext = await getPublicResumePdfContext();

        const graph = buildResumeOptimizationLoop();
        const state = await graph.invoke({
            latex: resume.latex,
            jdText,
            resumePdfContext: pdfContext?.available ? pdfContext.text : "",
            tone,
            targetScore: Math.max(6, Math.min(9.8, Number(targetScore || 8.8))),
            maxIterations: Math.max(1, Math.min(6, Number(maxIterations || 3))),
            writerModelId,
            reviewerModelId,
            humanizerModelId
        });

        const optimizedLatex = state?.latex || resume.latex;
        const updated = await updateResumeAndCreateVersion({
            id: resumeId,
            title: resume.title,
            latex: optimizedLatex,
            isDefault: resume.isDefault,
            source: "ai_loop_optimize",
            structured: ensureStructuredResume({ latex: optimizedLatex, structured: resume.structured })
        });

        return NextResponse.json({
            success: true,
            latex: updated.latex,
            structured: updated.structured,
            review: {
                score: Number(state?.score || 0),
                feedback: String(state?.feedback || ""),
                iterations: Number(state?.iteration || 0),
                targetScore: Number(targetScore || 8.8)
            }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message || "Optimization loop failed" }, { status: 500 });
    }
}
