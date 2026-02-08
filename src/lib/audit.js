import prisma from "@/lib/db";

export async function writeAudit({ userId, action, resource, resourceId, oldData, newData, ipAddress, userAgent }) {
    try {
        await prisma.auditLog.create({
            data: {
                userId: userId || "system",
                action,
                resource,
                resourceId: resourceId || null,
                oldData: oldData ? JSON.stringify(oldData) : null,
                newData: newData ? JSON.stringify(newData) : null,
                ipAddress: ipAddress || null,
                userAgent: userAgent || null
            }
        });
    } catch (e) {
        console.error("[audit] failed", e);
    }
}
