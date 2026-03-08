import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { sendMail } from "@/lib/mail";
import { render } from "@react-email/render";
import ColdEmailTemplate from "@/emails/ColdEmailTemplate";
import * as React from "react";

export const emailSendTool = new DynamicStructuredTool({
    name: "send_email",
    description: "Send an email via Graph API and log event",
    schema: z.object({
        to: z.string().email(),
        subject: z.string(),
        body: z.string(),
        campaignId: z.string().optional(),
        applicationId: z.string().optional(),
        recipientName: z.string().optional()
    }),
    func: async ({ to, subject, body, campaignId, applicationId, recipientName = "There" }) => {
        const emailHtml = await render(
            <ColdEmailTemplate bodyContent={body} recipientName={recipientName} />
        );

        await sendMail({ to, subject, html: emailHtml, text: body, campaignId, applicationId });
        return `Email sent to ${to}`;
    }
});
