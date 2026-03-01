import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { ensureProposalData } from "@/lib/proposals/defaults";
import { parseJsonFromModelText } from "@/lib/proposals/ai";
import { updateProposalAndCreateVersion } from "@/lib/proposals/versioning";
import { generateModelText } from "@/lib/ai/router";
import { DEFAULT_MODEL_ID } from "@/lib/ai/models";

function normalizeScore(value) {
    const num = Number(value);
    if (Number.isNaN(num)) return 0;
    return Math.max(0, Math.min(10, num));
}

export async function POST(req) {
    try {
        const { proposalId, modelId, enableGeminiWebSearch = false } = await req.json();
        if (!proposalId) {
            return NextResponse.json({ error: "proposalId is required" }, { status: 400 });
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

        const compactSections = data.sections.map((section) => `## ${section.title}\n${section.content || ""}`).join("\n\n");

        const prompt = `
You are an elite GSOC proposal reviewer.
Critique this proposal and score it like a strict mentor.

Proposal Title: ${proposal.title}
Organization: ${proposal.organization || "Not specified"}
Project Idea: ${proposal.projectIdea || "Not specified"}

Proposal Draft:
${compactSections}

Return strict JSON:
{
  "scores": {
    "clarity": 0-10,
    "feasibility": 0-10,
    "impact": 0-10,
    "originality": 0-10,
    "completeness": 0-10
  },
  "verdict": "short verdict",
  "recommendations": [
    "specific fix 1",
    "specific fix 2"
  ]
}

Rules:
- Recommendations must be concrete and actionable.
- Penalize vague implementation details.
- Do not include markdown fences.
`;
        const text = await generateModelText({
            modelId: modelId || DEFAULT_MODEL_ID,
            systemPrompt: "You are a strict GSOC mentor evaluating acceptance quality.",
            userPrompt: prompt,
            temperature: 0.2,
            maxTokens: 2200,
            enableWebSearch: Boolean(enableGeminiWebSearch)
        });
        const parsed = parseJsonFromModelText(text);

        const nextData = {
            ...data,
            meta: {
                ...data.meta,
                lastCritiqueAt: new Date().toISOString()
            },
            critique: {
                scores: {
                    clarity: normalizeScore(parsed?.scores?.clarity),
                    feasibility: normalizeScore(parsed?.scores?.feasibility),
                    impact: normalizeScore(parsed?.scores?.impact),
                    originality: normalizeScore(parsed?.scores?.originality),
                    completeness: normalizeScore(parsed?.scores?.completeness)
                },
                verdict: parsed?.verdict || "Needs refinement",
                recommendations: Array.isArray(parsed?.recommendations) ? parsed.recommendations.slice(0, 8) : []
            }
        };

        const updated = await updateProposalAndCreateVersion({
            id: proposal.id,
            title: proposal.title,
            organization: proposal.organization || "",
            projectIdea: proposal.projectIdea || "",
            tone: proposal.tone,
            data: nextData,
            source: "ai_critique"
        });

        return NextResponse.json({ success: true, proposal: updated });
    } catch (error) {
        return NextResponse.json({ error: error.message || "Failed to critique proposal" }, { status: 500 });
    }
}
