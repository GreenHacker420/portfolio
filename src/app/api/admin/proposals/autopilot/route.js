import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { ensureProposalData } from "@/lib/proposals/defaults";
import { parseJsonFromModelText } from "@/lib/proposals/ai";
import { updateProposalAndCreateVersion } from "@/lib/proposals/versioning";
import { generateModelText } from "@/lib/ai/router";
import { DEFAULT_MODEL_ID } from "@/lib/ai/models";
import { getMcpContext } from "@/lib/ai/mcp";
import { buildProposalOptimizationLoop } from "@/lib/langgraph/proposal-optimize-loop";

const DEFAULT_MCP_TOOLS = ["exa", "sequential-thinking", "web-search"];

function normalizeIdeas(value = []) {
    if (Array.isArray(value)) {
        return value.map((item) => String(item || "").trim()).filter(Boolean);
    }
    return String(value || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
}

function sanitizeToolList(value) {
    if (!Array.isArray(value)) return DEFAULT_MCP_TOOLS;
    const allowed = new Set(["exa", "sequential-thinking", "web-search"]);
    const list = value
        .map((item) => String(item || "").trim().toLowerCase())
        .filter((item) => allowed.has(item));
    return list.length > 0 ? Array.from(new Set(list)) : DEFAULT_MCP_TOOLS;
}

function sectionsToText(sections = []) {
    return sections.map((section) => `## ${section.title}\n${section.content || ""}`).join("\n\n");
}

export async function POST(req) {
    try {
        const {
            proposalId,
            ideaCandidates = [],
            tone,
            writerModelId = DEFAULT_MODEL_ID,
            reviewerModelId = DEFAULT_MODEL_ID,
            humanizerModelId = DEFAULT_MODEL_ID,
            targetScore = 9.2,
            maxIterations = 4,
            useMcp = true,
            mcpTools = DEFAULT_MCP_TOOLS,
            enableGeminiWebSearch = true
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

        const candidates = normalizeIdeas(ideaCandidates);
        const selectedMcpTools = sanitizeToolList(mcpTools);

        let mcpContext = "";
        let mcpUsed = false;
        let mcpToolsUsed = [];
        if (useMcp !== false) {
            const mcp = await getMcpContext({
                query: `${proposal.organization || ""} GSOC selected accepted proposals, proposal patterns, timeline, impact`,
                scope: "proposal_autopilot",
                mode: "research",
                toolsRequested: selectedMcpTools,
                payload: {
                    organization: proposal.organization || "",
                    title: proposal.title,
                    projectIdea: proposal.projectIdea || "",
                    ideaCandidates: candidates
                }
            });
            mcpContext = mcp.context || "";
            mcpUsed = mcp.enabled && Boolean(mcpContext);
            mcpToolsUsed = mcp.toolsUsed || [];
        }

        let rankedIdeas = [];
        let selectedIdea = proposal.projectIdea || "";
        if (candidates.length > 0) {
            const rankingPrompt = `
Rank the following GSOC ideas for organization "${proposal.organization || "unknown"}".
Prioritize: acceptance probability, feasibility, measurable impact, and lower competition.

Idea candidates:
${candidates.map((idea, index) => `${index + 1}. ${idea}`).join("\n")}

MCP/web research context:
${mcpContext || "Not available"}

Return strict JSON:
{
  "rankedIdeas": [
    {
      "idea": "...",
      "alignmentScore": 0-10,
      "feasibilityScore": 0-10,
      "competitionScore": 0-10,
      "impactScore": 0-10,
      "finalScore": 0-10,
      "reason": "..."
    }
  ],
  "selectedIdea": "..."
}
`;
            const rankingText = await generateModelText({
                modelId: writerModelId || DEFAULT_MODEL_ID,
                systemPrompt: "You are a GSOC strategy evaluator. Pick high-impact and lower-competition ideas.",
                userPrompt: rankingPrompt,
                temperature: 0.2,
                maxTokens: 2200,
                enableWebSearch: Boolean(enableGeminiWebSearch)
            });
            const ranking = parseJsonFromModelText(rankingText);
            rankedIdeas = Array.isArray(ranking?.rankedIdeas) ? ranking.rankedIdeas : [];
            selectedIdea = String(ranking?.selectedIdea || rankedIdeas?.[0]?.idea || selectedIdea || "").trim();
        }

        const researchPrompt = `
You are a GSOC deep research engine.
Build a complete research pack for proposal drafting.

Organization: ${proposal.organization || "Not specified"}
Proposal title: ${proposal.title}
Selected idea: ${selectedIdea || proposal.projectIdea || "Not specified"}
Tone: ${tone || proposal.tone || "academic"}

Find and summarize:
- organization priorities and accepted proposal patterns
- technical expectations and deliverable quality bar
- realistic timeline structure for coding period
- measurable impact metrics
- risk mitigation patterns

MCP context:
${mcpContext || "Not available"}

Return strict JSON:
{
  "researchPack": {
    "orgAcceptedProposalPatterns": ["..."],
    "requirements": ["..."],
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
  "mentorQuestions": ["..."]
}
`;
        const researchText = await generateModelText({
            modelId: writerModelId || DEFAULT_MODEL_ID,
            systemPrompt: "You are an expert GSOC researcher.",
            userPrompt: researchPrompt,
            temperature: 0.25,
            maxTokens: 3600,
            enableWebSearch: Boolean(enableGeminiWebSearch)
        });
        const research = parseJsonFromModelText(researchText);
        const researchPack = research?.researchPack || null;
        const mentorQuestions = Array.isArray(research?.mentorQuestions) ? research.mentorQuestions.slice(0, 20) : [];

        const draftingPrompt = `
You are an elite GSOC proposal drafter.
Generate a full proposal draft from this research pack.

Selected idea: ${selectedIdea || "Not specified"}
Research pack:
${researchPack ? JSON.stringify(researchPack, null, 2) : "Not available"}

Current draft:
${sectionsToText(data.sections)}

Return strict JSON:
{
  "sections": [
    { "key": "problem_statement", "title": "Problem Statement", "content": "..." },
    { "key": "proposed_solution", "title": "Proposed Solution", "content": "..." },
    { "key": "implementation_plan", "title": "Implementation Plan", "content": "..." },
    { "key": "timeline", "title": "Timeline & Milestones", "content": "..." },
    { "key": "impact", "title": "Expected Impact", "content": "..." },
    { "key": "risks", "title": "Risks & Mitigations", "content": "..." },
    { "key": "about_me", "title": "Why I am a Good Fit", "content": "..." }
  ]
}
`;
        const draftText = await generateModelText({
            modelId: writerModelId || DEFAULT_MODEL_ID,
            systemPrompt: "You write high-acceptance GSOC proposals with concrete milestones.",
            userPrompt: draftingPrompt,
            temperature: 0.3,
            maxTokens: 3800,
            enableWebSearch: Boolean(enableGeminiWebSearch)
        });
        const draftParsed = parseJsonFromModelText(draftText);
        const draftedSections = Array.isArray(draftParsed?.sections) ? draftParsed.sections : data.sections;

        const graph = buildProposalOptimizationLoop();
        const loopState = await graph.invoke({
            sections: draftedSections,
            organization: proposal.organization || "",
            projectIdea: selectedIdea || proposal.projectIdea || "",
            researchContext: researchPack ? JSON.stringify(researchPack, null, 2) : "",
            tone: tone || proposal.tone || "academic",
            targetScore: Math.max(6, Math.min(9.8, Number(targetScore || 9.2))),
            maxIterations: Math.max(1, Math.min(6, Number(maxIterations || 4))),
            writerModelId,
            reviewerModelId,
            humanizerModelId,
            enableGeminiWebSearch: Boolean(enableGeminiWebSearch)
        });

        const nextData = {
            ...data,
            sections: loopState.sections || draftedSections,
            meta: {
                ...(data.meta || {}),
                title: proposal.title,
                organization: proposal.organization || "",
                projectIdea: selectedIdea || proposal.projectIdea || "",
                program: "GSOC",
                lastResearchAt: new Date().toISOString(),
                research: researchPack,
                mentorQuestions,
                ideaCandidates: candidates,
                rankedIdeas,
                selectedIdea,
                researchOptions: {
                    useMcp: useMcp !== false,
                    requestedMcpTools: selectedMcpTools,
                    nativeGeminiWebSearch: Boolean(enableGeminiWebSearch)
                },
                autopilot: {
                    targetScore: Math.max(6, Math.min(9.8, Number(targetScore || 9.2))),
                    maxIterations: Math.max(1, Math.min(6, Number(maxIterations || 4))),
                    achievedScore: Number(loopState?.score || 0),
                    iterations: Number(loopState?.iteration || 0)
                }
            },
            critique: {
                ...(data.critique || {}),
                verdict: `Autopilot score ${Number(loopState?.score || 0).toFixed(1)} / 10`,
                recommendations: [String(loopState?.feedback || "No reviewer feedback")]
            }
        };

        const updated = await updateProposalAndCreateVersion({
            id: proposal.id,
            title: proposal.title,
            organization: proposal.organization || "",
            projectIdea: selectedIdea || proposal.projectIdea || "",
            tone: tone || proposal.tone || "academic",
            data: nextData,
            source: "ai_autopilot_full"
        });

        return NextResponse.json({
            success: true,
            proposal: updated,
            selectedIdea: selectedIdea || "",
            rankedIdeas,
            review: {
                score: Number(loopState?.score || 0),
                feedback: String(loopState?.feedback || ""),
                iterations: Number(loopState?.iteration || 0)
            },
            mcpUsed,
            mcpToolsUsed
        });
    } catch (error) {
        return NextResponse.json({ error: error.message || "Autopilot failed" }, { status: 500 });
    }
}
