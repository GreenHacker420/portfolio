
import { getAllProposals, createProposalRecord, createProposalVersionRecord } from "@/repositories/proposal.repository";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";

export const GET = withApiHandler(async () => {
    await requireAdmin();
    const proposals = await getAllProposals();
    return apiOk(proposals);
});

export const POST = withApiHandler(async (req) => {
    await requireAdmin();
    const body = await req.json();
    const proposal = await createProposalRecord({
        title: body.title,
        organization: body.organization,
        projectIdea: body.projectIdea,
        tone: body.tone || "academic",
        data: body.data || {}
    });

    await createProposalVersionRecord({
        proposalId: proposal.id,
        title: proposal.title,
        tone: proposal.tone,
        data: proposal.data,
        source: "create"
    });

    return apiOk(proposal);
});
