import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";
import { restoreResumeVersion } from "@/lib/resume/versioning";

export const POST = withApiHandler(async (req, { params }) => {
    await requireAdmin();
    const { id } = await params;
    const { versionId } = await req.json();

    if (!versionId) {
        throw new Error("versionId is required");
    }

    const restored = await restoreResumeVersion({ resumeId: id, versionId });
    if (!restored) {
        throw new Error("Version not found");
    }

    return apiOk({ success: true, resume: restored });
});
