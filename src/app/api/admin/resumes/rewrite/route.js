import prisma from "@/lib/db";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";
import { updateResumeAndCreateVersion } from "@/lib/resume/versioning";
import { ensureStructuredResume } from "@/lib/resume/structured";
import { generateModelText } from "@/lib/ai/router";
import { DEFAULT_MODEL_ID } from "@/lib/ai/models";
import { getPublicResumePdfContext } from "@/lib/resume/pdf-context";

export const POST = withApiHandler(async (req) => {
    await requireAdmin();
    const { resumeId, jdText, modelId } = await req.json();
    if (!resumeId || !jdText) throw new Error("resumeId and jdText required");

    const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
    if (!resume) throw new Error("resume not found");
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

    return apiOk({ success: true, latex: updated.latex, structured: updated.structured });
});
