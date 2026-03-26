import { processFollowups } from "@/lib/scheduler/followups";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";

export const POST = withApiHandler(async () => {
    await requireAdmin();
    const result = await processFollowups();
    return apiOk(result);
});
