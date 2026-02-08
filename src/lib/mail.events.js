import prisma from "@/lib/db";

export async function logEmailEvent({ campaignId, applicationId, toAddress, type, metadata }) {
    try {
        await prisma.emailEvent.create({
            data: {
                campaignId: campaignId || null,
                applicationId: applicationId || null,
                toAddress: toAddress || null,
                type,
                metadata: metadata || undefined
            }
        });
    } catch (e) {
        console.error("[emailEvent] failed", e);
    }
}
