import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { sendMail } from "@/lib/mail";

export const emailSendTool = new DynamicStructuredTool({
    name: "send_email",
    description: "Send an email via Graph API and log event",
    schema: z.object({
        to: z.string().email(),
        subject: z.string(),
        body: z.string(),
        campaignId: z.string().optional(),
        applicationId: z.string().optional()
    }),
    func: async ({ to, subject, body, campaignId, applicationId }) => {
        await sendMail({ to, subject, html: body, campaignId, applicationId });
        return `Email sent to ${to}`;
    }
});
