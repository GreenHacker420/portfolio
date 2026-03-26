import { rollupAnalytics } from "@/actions/analytics";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";
import { cleanupChatCheckpoints } from "@/lib/chatbot/checkpointer";

// Intended to be called by cron/automation
export const POST = withApiHandler(async () => {
    await requireAdmin();
    const result = await rollupAnalytics(1);
    
    // Also cleanup stale chatbot sessions
    const cleanedCount = await cleanupChatCheckpoints(24);
    
    return apiOk({ ...result, cleanedCheckpoints: cleanedCount });
});
