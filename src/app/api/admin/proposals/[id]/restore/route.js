import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";
import { restoreProposalVersion } from "@/lib/proposals/versioning";

export const POST = withApiHandler(async (req, { params }) => {
    await requireAdmin();
    const { id } = await params;
    const { versionId } = await req.json();

    if (!versionId) {
        throw new Error("versionId is required");
    }

    const restored = await restoreProposalVersion({ proposalId: id, versionId });
    if (!restored) {
        throw new Error("Proposal version not found");
    }

    return apiOk({ success: true, proposal: restored });
});
