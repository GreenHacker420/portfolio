import { rollupAnalytics } from "@/actions/analytics";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";

// For hosting provider cron hooks
export const GET = withApiHandler(async () => {
    await requireAdmin();
    const result = await rollupAnalytics(1);
    return apiOk(result);
});
