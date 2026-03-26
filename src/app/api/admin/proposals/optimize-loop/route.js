import prisma from "@/lib/db";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";
import { ensureProposalData } from "@/lib/proposals/defaults";
import { updateProposalAndCreateVersion } from "@/lib/proposals/versioning";
import { buildProposalOptimizationLoop } from "@/lib/langgraph/proposal-optimize-loop";
import { DEFAULT_MODEL_ID } from "@/lib/ai/models";

export const POST = withApiHandler(async (req) => {
    await requireAdmin();
    const {
        proposalId,
        targetScore = 8.8,
        maxIterations = 3,
        writerModelId = DEFAULT_MODEL_ID,
        reviewerModelId = DEFAULT_MODEL_ID,
        humanizerModelId = DEFAULT_MODEL_ID,
        tone,
        enableGeminiWebSearch = false
    } = await req.json();

    if (!proposalId) {
        throw new Error("proposalId is required");
    }

    const proposal = await prisma.proposal.findUnique({ where: { id: proposalId } });
    if (!proposal) {
        throw new Error("proposal not found");
    }

    const data = ensureProposalData(proposal.data, {
        title: proposal.title,
        organization: proposal.organization || "",
        projectIdea: proposal.projectIdea || ""
    });

    const graph = buildProposalOptimizationLoop();
    const state = await graph.invoke({
        sections: data.sections,
        organization: proposal.organization || "",
        projectIdea: proposal.projectIdea || "",
        researchContext: data?.meta?.research ? JSON.stringify(data.meta.research, null, 2) : "",
        tone: tone || proposal.tone || "academic",
        targetScore: Math.max(6, Math.min(9.8, Number(targetScore || 8.8))),
        maxIterations: Math.max(1, Math.min(6, Number(maxIterations || 3))),
        writerModelId,
        reviewerModelId,
        humanizerModelId,
        enableGeminiWebSearch: Boolean(enableGeminiWebSearch)
    });

    const nextData = {
        ...data,
        sections: state.sections || data.sections,
        meta: {
            ...data.meta,
            lastCritiqueAt: new Date().toISOString()
        },
        critique: {
            ...data.critique,
            verdict: `Loop score ${Number(state.score || 0).toFixed(1)} / 10`,
            recommendations: [String(state.feedback || "No reviewer feedback")]
        }
    };

    const updated = await updateProposalAndCreateVersion({
        id: proposal.id,
        title: proposal.title,
        organization: proposal.organization || "",
        projectIdea: proposal.projectIdea || "",
        tone: tone || proposal.tone,
        data: nextData,
        source: "ai_loop_optimize"
    });

    return apiOk({
        success: true,
        proposal: updated,
        review: {
            score: Number(state.score || 0),
            feedback: String(state.feedback || ""),
            iterations: Number(state.iteration || 0),
            targetScore: Number(targetScore || 8.8)
        }
    });
});
