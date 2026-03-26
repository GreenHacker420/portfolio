
'use server'

import { requireAdmin } from "@/lib/guard";
import { withErrorHandler } from "@/lib/response";
import { 
    getGlobalStats, 
    getRecentContacts, 
    getRecentAuditLogs 
} from "@/repositories/admin.repository";
import { getSettings } from "@/repositories/settings.repository";

function maskSecret(val) {
    if (!val) return "not configured";
    if (val.length <= 4) return "****";
    return "*".repeat(val.length - 4) + val.slice(-4);
}

export async function getMaskedSettings() {
    return withErrorHandler(async () => {
        await requireAdmin();
        const settings = await getSettings();
        
        // Only keys that we consider sensitive
        const sensitiveKeys = [
            "GOOGLE_API_KEY",
            "PINECONE_API_KEY",
            "AZURE_CLIENT_SECRET",
            "GITHUB_TOKEN",
            "JSEARCH_API_KEY",
            "ADZUNA_API_KEY"
        ];

        return settings.map(s => ({
            key: s.key,
            value: sensitiveKeys.includes(s.key) ? maskSecret(s.value) : s.value
        }));
    });
}

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
