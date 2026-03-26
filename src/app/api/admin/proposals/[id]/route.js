import prisma from "@/lib/db";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";
import { updateProposalAndCreateVersion } from "@/lib/proposals/versioning";
import { ensureProposalData } from "@/lib/proposals/defaults";

export const GET = withApiHandler(async (req, { params }) => {
    await requireAdmin();
    const { id } = await params;
    const proposal = await prisma.proposal.findUnique({
        where: { id }
    });

    if (!proposal) {
        throw new Error("Proposal not found");
    }

    return apiOk(proposal);
});

export const PUT = withApiHandler(async (req, { params }) => {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const title = typeof body.title === "string" && body.title.trim() ? body.title.trim() : "GSOC Proposal";
    const organization = typeof body.organization === "string" ? body.organization.trim() : "";
    const projectIdea = typeof body.projectIdea === "string" ? body.projectIdea.trim() : "";
    const tone = typeof body.tone === "string" && body.tone.trim() ? body.tone.trim() : "academic";

    const proposal = await updateProposalAndCreateVersion({
        id,
        title,
        organization,
        projectIdea,
        tone,
        source: body.source || "manual",
        data: ensureProposalData(body.data, { title, organization, projectIdea })
    });

    return apiOk(proposal);
});

export const DELETE = withApiHandler(async (req, { params }) => {
    await requireAdmin();
    const { id } = await params;
    await prisma.proposal.delete({ where: { id } });
    return apiOk({ success: true });
});
