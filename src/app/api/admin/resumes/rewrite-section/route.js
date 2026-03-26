import prisma from "@/lib/db";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";
import { ensureStructuredResume, applySectionContentToLatex } from "@/lib/resume/structured";
import { updateResumeAndCreateVersion } from "@/lib/resume/versioning";
import { generateModelText } from "@/lib/ai/router";
import { DEFAULT_MODEL_ID } from "@/lib/ai/models";
import { getPublicResumePdfContext } from "@/lib/resume/pdf-context";

const ALLOWED_TONES = new Set(["formal", "concise", "confident", "technical", "humanized"]);

export const POST = withApiHandler(async (req) => {
    await requireAdmin();
    const { resumeId, jdText, sectionKey, tone, instruction, modelId } = await req.json();
    if (!resumeId || !jdText || !sectionKey) {
        throw new Error("resumeId, jdText and sectionKey are required");
    }

    const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
    if (!resume) {
        throw new Error("resume not found");
    }
    const pdfContext = await getPublicResumePdfContext();

    const structured = ensureStructuredResume({ latex: resume.latex, structured: resume.structured });
    const sections = structured?.sections || {};
    const targetSection = sections[sectionKey];

    if (!targetSection) {
        throw new Error("section not found");
    }

    const resolvedTone = ALLOWED_TONES.has(String(tone || "").toLowerCase()) ? tone.toLowerCase() : "concise";
    const githubEvidence = await prisma.knowledgeSnippet.findMany({
        where: { source: { startsWith: "GitHub:" } },
        orderBy: { updatedAt: "desc" },
        take: 8,
        select: { content: true }
    });
    const evidenceText = githubEvidence.map((item) => `- ${item.content}`).join("\n");

    const prompt = `
You are an expert resume writer.
Rewrite only the provided resume section for the target job description.
Keep claims factual and do not invent numbers, companies, or roles.
Tone: ${resolvedTone}
Special user instruction: ${instruction || "Optimize impact, clarity, and keyword alignment."}

Job Description:
${jdText}

Section Name:
${targetSection.title || sectionKey}

Current Section Content:
${targetSection.content || ""}

Additional Evidence (optional, only use if relevant):
${evidenceText || "None"}

Reference context from existing resume.pdf (use facts only if relevant):
${pdfContext?.available ? pdfContext.text : "Not available"}

Return only rewritten section text. No markdown fences.
`;
    const rewritten = (await generateModelText({
        modelId: modelId || DEFAULT_MODEL_ID,
        systemPrompt: "You are a section-level resume editor focused on measurable impact and factual precision.",
        userPrompt: prompt,
        temperature: 0.25,
        maxTokens: 2000
    }))
        .replace(/```/g, "")
        .trim();

    if (!rewritten) {
        throw new Error("empty rewrite result");
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

    return apiOk({
        success: true,
        latex: updated.latex,
        structured: updated.structured,
        sectionKey,
        tone: resolvedTone
    });
});
