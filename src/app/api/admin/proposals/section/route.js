import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { ensureProposalData } from "@/lib/proposals/defaults";
import { updateProposalAndCreateVersion } from "@/lib/proposals/versioning";
import { generateModelText } from "@/lib/ai/router";
import { DEFAULT_MODEL_ID } from "@/lib/ai/models";

const ALLOWED_TONES = new Set(["academic", "technical", "humanized", "concise", "confident"]);

export async function POST(req) {
    try {
        const { proposalId, sectionKey, instruction, tone, modelId, enableGeminiWebSearch = false } = await req.json();
        if (!proposalId || !sectionKey) {
            return NextResponse.json({ error: "proposalId and sectionKey are required" }, { status: 400 });
        }

        const proposal = await prisma.proposal.findUnique({ where: { id: proposalId } });
        if (!proposal) {
            return NextResponse.json({ error: "proposal not found" }, { status: 404 });
        }

        const data = ensureProposalData(proposal.data, {
            title: proposal.title,
            organization: proposal.organization || "",
            projectIdea: proposal.projectIdea || ""
        });

        const targetSection = data.sections.find((section) => section.key === sectionKey);
        if (!targetSection) {
            return NextResponse.json({ error: "section not found" }, { status: 404 });
        }

        const resolvedTone = ALLOWED_TONES.has(String(tone || "").toLowerCase())
            ? String(tone).toLowerCase()
            : (proposal.tone || "academic");

        const prompt = `
You are a top-tier GSOC proposal writing assistant.
Rewrite and improve one section to maximize reviewer confidence.

Proposal Title: ${proposal.title}
Organization: ${proposal.organization || "Not specified"}
Project Idea: ${proposal.projectIdea || "Not specified"}
Section: ${targetSection.title}
Tone: ${resolvedTone}

Instruction: ${instruction || "Make it specific, technically credible, and high-impact."}

Current Content:
${targetSection.content || ""}

Research context:
${data?.meta?.research ? JSON.stringify(data.meta.research, null, 2) : "Not available"}

Output plain text only for the rewritten section content. Do not wrap in JSON.
`;
        const rewrittenContent = (await generateModelText({
            modelId: modelId || DEFAULT_MODEL_ID,
            systemPrompt: "You are an elite proposal section writer focused on feasibility and clarity.",
            userPrompt: prompt,
            temperature: 0.35,
            maxTokens: 2200,
            enableWebSearch: Boolean(enableGeminiWebSearch)
        }))
            .replace(/```/g, "")
            .trim();

        if (!rewrittenContent) {
            return NextResponse.json({ error: "empty section rewrite result" }, { status: 500 });
        }

        const nextSections = data.sections.map((section) => {
            if (section.key !== sectionKey) return section;
            return {
                ...section,
                content: rewrittenContent
            };
        });

        const updated = await updateProposalAndCreateVersion({
            id: proposal.id,
            title: proposal.title,
            organization: proposal.organization || "",
            projectIdea: proposal.projectIdea || "",
            tone: resolvedTone,
            data: {
                ...data,
                sections: nextSections
            },
            source: `ai_section_${sectionKey}`
        });

        return NextResponse.json({
            success: true,
            proposal: updated,
            sectionKey
        });
    } catch (error) {
        return NextResponse.json({ error: error.message || "Failed to generate section" }, { status: 500 });
    }
}
