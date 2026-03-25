
'use server'

import { requireAdmin } from "@/lib/guard";
import { withErrorHandler } from "@/lib/response";
import { 
    getGlobalStats, 
    getRecentContacts, 
    getRecentAuditLogs 
} from "@/repositories/admin.repository";

export async function getAdminStats() {
    return withErrorHandler(async () => {
        await requireAdmin();

        const stats = await getGlobalStats();
        const recentContacts = await getRecentContacts(5);
        const recentAuditLogs = await getRecentAuditLogs(5);

        const systemHealth = {
            google: !!process.env.GOOGLE_API_KEY,
            pinecone: !!process.env.PINECONE_API_KEY,
            azure: !!(process.env.AZURE_CLIENT_ID && process.env.AZURE_TENANT_ID && process.env.AZURE_CLIENT_SECRET),
            github: !!process.env.GITHUB_TOKEN,
            email: !!process.env.EMAIL_USER,
            database: true,
        };

        return {
            ...stats,
            recentContacts,
            recentAuditLogs,
            systemHealth,
        };
    });
}
