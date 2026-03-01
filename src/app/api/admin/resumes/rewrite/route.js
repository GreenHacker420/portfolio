import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { updateResumeAndCreateVersion } from "@/lib/resume/versioning";
import { ensureStructuredResume } from "@/lib/resume/structured";
import { generateModelText } from "@/lib/ai/router";
import { DEFAULT_MODEL_ID } from "@/lib/ai/models";
import { getPublicResumePdfContext } from "@/lib/resume/pdf-context";

export async function POST(req) {
    try {
        const { resumeId, jdText, modelId } = await req.json();
        if (!resumeId || !jdText) return NextResponse.json({ error: "resumeId and jdText required" }, { status: 400 });

        const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
        if (!resume) return NextResponse.json({ error: "resume not found" }, { status: 404 });
        const pdfContext = await getPublicResumePdfContext();

        const prompt = `
Tailor the following LaTeX resume to the job description. Keep LaTeX valid, concise, and emphasize matching skills. Return ONLY LaTeX.

Job Description:
${jdText}

Current Resume LaTeX:
${resume.latex}

Reference context from existing resume.pdf (use facts only if relevant):
${pdfContext?.available ? pdfContext.text : "Not available"}
`;
        const generated = await generateModelText({
            modelId: modelId || DEFAULT_MODEL_ID,
            systemPrompt: "You are a precise resume tailoring engine that preserves factual integrity.",
            userPrompt: prompt,
            temperature: 0.2,
            maxTokens: 3200
        });
        const newLatex = generated || resume.latex;

        const updated = await updateResumeAndCreateVersion({
            id: resumeId,
            title: resume.title,
            latex: newLatex,
            isDefault: resume.isDefault,
            source: "rewrite_jd",
            structured: ensureStructuredResume({ latex: newLatex, structured: resume.structured })
        });

        return NextResponse.json({ success: true, latex: updated.latex, structured: updated.structured });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
