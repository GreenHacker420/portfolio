import prisma from "@/lib/db";
import { addMinutes } from "date-fns";
import { logEmailEvent } from "@/lib/mail.events";
import { sendMail } from "@/lib/mail";

// Simple follow-up scheduler to run via cron/automation.
export async function processFollowups() {
    const now = new Date();
    const due = await prisma.application.findMany({
        where: { followupAt: { lte: addMinutes(now, 5) }, status: { in: ["queued", "sent", "followup_due"] } },
        include: { lead: true, recruiter: true }
    });

    for (const app of due) {
        if (!app.recruiter?.email) continue;
        const body = `<p>Following up on ${app.lead?.title} at ${app.lead?.company}.</p>`;
        await sendMail({
            to: app.recruiter.email,
            subject: `Follow-up: ${app.lead?.title} @ ${app.lead?.company}`,
            html: body,
            campaignId: null,
            applicationId: app.id,
            metadata: { followup: true }
        });
        await prisma.application.update({
            where: { id: app.id },
            data: { status: "followup_sent" }
        });
        await prisma.applicationEvent.create({
            data: { applicationId: app.id, type: "followup_sent" }
        });
        await logEmailEvent({ applicationId: app.id, toAddress: app.recruiter.email, type: "sent", metadata: { followup: true } });
    }
    return { processed: due.length };
}
