import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { ensureProposalData } from "@/lib/proposals/defaults";
import { parseJsonFromModelText } from "@/lib/proposals/ai";
import { updateProposalAndCreateVersion } from "@/lib/proposals/versioning";
import { generateModelText } from "@/lib/ai/router";
import { DEFAULT_MODEL_ID, parseModelId } from "@/lib/ai/models";
import { getMcpContext } from "@/lib/ai/mcp";

const DEFAULT_MCP_TOOLS = ["exa", "sequential-thinking", "web-search"];

function sectionsToText(sections = []) {
    return sections.map((section) => `## ${section.title}\n${section.content || ""}`).join("\n\n");
}

function sanitizeToolList(value) {
    if (!Array.isArray(value)) return DEFAULT_MCP_TOOLS;
    const allowed = new Set(["exa", "sequential-thinking", "web-search"]);
    const list = value
        .map((item) => String(item || "").trim().toLowerCase())
        .filter((item) => allowed.has(item));
    return list.length > 0 ? Array.from(new Set(list)) : DEFAULT_MCP_TOOLS;
}

function applySectionUpgrades(currentSections = [], sectionUpgrades = {}) {
    if (!sectionUpgrades || typeof sectionUpgrades !== "object") return currentSections;
    return currentSections.map((section) => {
        const nextContent = sectionUpgrades[section.key];
        if (!nextContent || typeof nextContent !== "string") return section;
        return {
            ...section,
            content: nextContent.trim()
        };
    });
}

export async function POST(req) {
    try {
        const {
            proposalId,
            modelId = DEFAULT_MODEL_ID,
            tone,
            useMcp = true,
            mcpTools = DEFAULT_MCP_TOOLS,
            enableGeminiWebSearch = true,
            applyToSections = true
        } = await req.json();

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

        const sanitizedTools = sanitizeToolList(mcpTools);
        const { provider } = parseModelId(modelId || DEFAULT_MODEL_ID);
        const useNativeWebSearch = Boolean(enableGeminiWebSearch) && provider === "google";

        const querySeed = [
            proposal.title,
            proposal.organization || "",
            proposal.projectIdea || "",
            "GSOC proposal requirements, timeline, milestones, impact metrics, acceptance criteria"
        ].filter(Boolean).join(" | ");

        let mcpContext = "";
        let mcpUsed = false;
        let mcpToolsUsed = [];

        if (useMcp !== false) {
            const mcp = await getMcpContext({
                query: querySeed,
                scope: "proposal_deep_research",
                mode: "research",
                toolsRequested: sanitizedTools,
                payload: {
                    proposalTitle: proposal.title,
                    organization: proposal.organization || "",
                    projectIdea: proposal.projectIdea || "",
                    tone: tone || proposal.tone || "academic",
                    sections: data.sections
                }
            });
            mcpContext = mcp.context || "";
            mcpUsed = mcp.enabled && Boolean(mcpContext);
            mcpToolsUsed = mcp.toolsUsed || [];
        }

        const prompt = `
You are an elite GSOC proposal research strategist.
Build a deep research pack and section-level upgrades for acceptance quality.

Proposal:
- Title: ${proposal.title}
- Organization: ${proposal.organization || "Not specified"}
- Project idea: ${proposal.projectIdea || "Not specified"}
- Tone: ${tone || proposal.tone || "academic"}

Current draft:
${sectionsToText(data.sections)}

MCP research context:
${mcpContext || "Not available"}

Return strict JSON:
{
  "researchPack": {
    "requirements": ["..."],
    "orgSignals": ["..."],
    "technicalPlan": ["..."],
    "timelinePlan": {
      "communityBonding": ["..."],
      "codingWeeks": [
        { "week": "1-2", "goals": ["..."], "deliverables": ["..."], "validation": "..." }
      ]
    },
    "impactPlan": {
      "beneficiaries": ["..."],
      "metrics": ["..."],
      "measurementPlan": ["..."]
    },
    "riskMatrix": [
      { "risk": "...", "probability": "low|medium|high", "impact": "low|medium|high", "mitigation": "..." }
    ],
    "proposalChecklist": ["..."],
    "references": [
      { "title": "...", "url": "...", "whyRelevant": "..." }
    ]
  },
  "sectionUpgrades": {
    "problem_statement": "...",
    "proposed_solution": "...",
    "implementation_plan": "...",
    "timeline": "...",
    "impact": "...",
    "risks": "...",
    "about_me": "..."
  },
  "mentorQuestions": ["..."]
}

Rules:
- Be concrete, technically realistic, and reviewer-focused.
- Timeline must be milestone-driven and testable.
- Impact metrics must be measurable.
- Do not include markdown fences.
`;

        const generated = await generateModelText({
            modelId: modelId || DEFAULT_MODEL_ID,
            systemPrompt: "You are a GSOC research + strategy engine for high-quality proposals.",
            userPrompt: prompt,
            temperature: 0.25,
            maxTokens: 4200,
            enableWebSearch: useNativeWebSearch
        });

        const parsed = parseJsonFromModelText(generated);
        const sectionUpgrades = parsed?.sectionUpgrades && typeof parsed.sectionUpgrades === "object"
            ? parsed.sectionUpgrades
            : {};
        const nextSections = applyToSections
            ? applySectionUpgrades(data.sections, sectionUpgrades)
            : data.sections;

        const nextData = {
            ...data,
            sections: nextSections,
            meta: {
                ...(data.meta || {}),
                title: proposal.title,
                organization: proposal.organization || "",
                projectIdea: proposal.projectIdea || "",
                program: "GSOC",
                lastResearchAt: new Date().toISOString(),
                research: parsed?.researchPack || null,
                mentorQuestions: Array.isArray(parsed?.mentorQuestions) ? parsed.mentorQuestions.slice(0, 20) : [],
                researchOptions: {
                    useMcp: useMcp !== false,
                    requestedMcpTools: sanitizedTools,
                    nativeGeminiWebSearch: useNativeWebSearch
                }
            }
        };

        const updated = await updateProposalAndCreateVersion({
            id: proposal.id,
            title: proposal.title,
            organization: proposal.organization || "",
            projectIdea: proposal.projectIdea || "",
            tone: tone || proposal.tone || "academic",
            data: nextData,
            source: "ai_deep_research"
        });

        return NextResponse.json({
            success: true,
            proposal: updated,
            researchPack: nextData?.meta?.research || null,
            mentorQuestions: nextData?.meta?.mentorQuestions || [],
            mcpUsed,
            mcpToolsUsed,
            nativeGeminiWebSearch: useNativeWebSearch
        });
    } catch (error) {
        return NextResponse.json({ error: error.message || "Deep research failed" }, { status: 500 });
    }
}
