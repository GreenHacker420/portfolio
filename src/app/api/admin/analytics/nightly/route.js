import { rollupAnalytics } from "@/actions/analytics";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";

// Intended to be called by cron/automation
export const POST = withApiHandler(async () => {
    await requireAdmin();
    const result = await rollupAnalytics(1);
    return apiOk(result);
});
