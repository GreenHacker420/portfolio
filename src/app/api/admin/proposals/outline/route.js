import prisma from "@/lib/db";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { ensureProposalData, GSOC_SECTION_ORDER } from "@/lib/proposals/defaults";
import { parseJsonFromModelText } from "@/lib/proposals/ai";
import { updateProposalAndCreateVersion } from "@/lib/proposals/versioning";

export async function POST(req) {
    try {
        const { proposalId } = await req.json();
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

        const sectionsGuide = GSOC_SECTION_ORDER.map((section) => `${section.key}: ${section.title}`).join("\n");
        const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
        const prompt = `
You are a world-class Google Summer of Code proposal strategist.
Generate a compelling, realistic, and specific proposal outline.

Proposal Title: ${proposal.title}
Organization: ${proposal.organization || "Not specified"}
Project Idea: ${proposal.projectIdea || "Not specified"}
Preferred Tone: ${proposal.tone}

Required section keys:
${sectionsGuide}

Return strict JSON:
{
  "sections": [
    { "key": "problem_statement", "title": "Problem Statement", "content": "..." }
  ]
}

Rules:
- Keep content practical and reviewer-friendly.
- Make timeline and implementation details concrete.
- Do not include markdown fences.
`;

        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        const text = typeof result.text === "function" ? result.text() : result.text || "";
        const parsed = parseJsonFromModelText(text);
        const generatedSections = Array.isArray(parsed?.sections) ? parsed.sections : [];

        const generatedMap = new Map(
            generatedSections
                .filter((section) => section && section.key)
                .map((section) => [section.key, section])
        );

        const mergedSections = data.sections.map((section) => {
            const generated = generatedMap.get(section.key);
            if (!generated) return section;
            return {
                ...section,
                title: generated.title || section.title,
                content: String(generated.content || section.content || "")
            };
        });

        const nextData = {
            ...data,
            sections: mergedSections
        };

        const updated = await updateProposalAndCreateVersion({
            id: proposal.id,
            title: proposal.title,
            organization: proposal.organization || "",
            projectIdea: proposal.projectIdea || "",
            tone: proposal.tone,
            data: nextData,
            source: "ai_outline"
        });

        return NextResponse.json({ success: true, proposal: updated });
    } catch (error) {
        return NextResponse.json({ error: error.message || "Failed to generate outline" }, { status: 500 });
    }
}
