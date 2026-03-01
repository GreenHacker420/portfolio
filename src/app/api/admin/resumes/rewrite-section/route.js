import prisma from "@/lib/db";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { ensureStructuredResume, applySectionContentToLatex } from "@/lib/resume/structured";
import { updateResumeAndCreateVersion } from "@/lib/resume/versioning";

const ALLOWED_TONES = new Set(["formal", "concise", "confident", "technical", "humanized"]);

export async function POST(req) {
    try {
        const { resumeId, jdText, sectionKey, tone } = await req.json();
        if (!resumeId || !jdText || !sectionKey) {
            return NextResponse.json({ error: "resumeId, jdText and sectionKey are required" }, { status: 400 });
        }

        const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
        if (!resume) {
            return NextResponse.json({ error: "resume not found" }, { status: 404 });
        }

        const structured = ensureStructuredResume({ latex: resume.latex, structured: resume.structured });
        const sections = structured?.sections || {};
        const targetSection = sections[sectionKey];

        if (!targetSection) {
            return NextResponse.json({ error: "section not found" }, { status: 404 });
        }

        const resolvedTone = ALLOWED_TONES.has(String(tone || "").toLowerCase()) ? tone.toLowerCase() : "concise";
        const githubEvidence = await prisma.knowledgeSnippet.findMany({
            where: { source: { startsWith: "GitHub:" } },
            orderBy: { updatedAt: "desc" },
            take: 8,
            select: { content: true }
        });
        const evidenceText = githubEvidence.map((item) => `- ${item.content}`).join("\n");

        const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
        const prompt = `
You are an expert resume writer.
Rewrite only the provided resume section for the target job description.
Keep claims factual and do not invent numbers, companies, or roles.
Tone: ${resolvedTone}

Job Description:
${jdText}

Section Name:
${targetSection.title || sectionKey}

Current Section Content:
${targetSection.content || ""}

Additional Evidence (optional, only use if relevant):
${evidenceText || "None"}

Return only rewritten section text. No markdown fences.
`;

        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        const rewritten = (typeof result.text === "function" ? result.text() : result.text || "")
            .replace(/```/g, "")
            .trim();

        if (!rewritten) {
            return NextResponse.json({ error: "empty rewrite result" }, { status: 500 });
        }

        const nextStructured = {
            ...structured,
            sections: {
                ...sections,
                [sectionKey]: {
                    ...targetSection,
                    content: rewritten
                }
            }
        };

        const nextLatex = applySectionContentToLatex(
            resume.latex,
            targetSection.title || sectionKey,
            rewritten
        );

        const updated = await updateResumeAndCreateVersion({
            id: resumeId,
            title: resume.title,
            latex: nextLatex,
            isDefault: resume.isDefault,
            source: `rewrite_section_${sectionKey}`,
            structured: nextStructured
        });

        return NextResponse.json({
            success: true,
            latex: updated.latex,
            structured: updated.structured,
            sectionKey,
            tone: resolvedTone
        });
    } catch (error) {
        return NextResponse.json({ error: error.message || "Failed to rewrite section" }, { status: 500 });
    }
}
