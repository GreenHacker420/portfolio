import { rollupAnalytics } from "@/actions/analytics";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";
import { cleanupChatCheckpoints } from "@/lib/chatbot/checkpointer";
import { headers as nextHeaders } from "next/headers";

// Intended to be called by cron/automation
export const POST = withApiHandler(async () => {
    await requireAdmin();
    const result = await rollupAnalytics(1);
    
    const cleanedCount = await cleanupChatCheckpoints(24);

    try {
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        await fetch(`${baseUrl}/api/admin/kb/sync`, {
            method: "POST",
            headers: await nextHeaders()
        });
    } catch (e) {
        console.error("[Nightly Cron] KB Sync trigger failed:", e);
    }
    
    return apiOk({ 
        ...result, 
        cleanedCheckpoints: cleanedCount,
        kbSyncTriggered: true
    });
});
