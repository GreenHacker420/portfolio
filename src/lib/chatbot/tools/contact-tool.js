import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import prisma from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { render } from "@react-email/render";
import ContactReplyEmail from "@/emails/ContactTemplate";
import AdminTemplate from "@/emails/AdminTemplate";

export const contactTool = new DynamicStructuredTool({
    name: "submit_contact_form",
    description: "Submit a contact form or send a message to the portfolio owner (Harsh) on behalf of the user. Use this when the user wants to get in touch.",
    schema: z.object({
        name: z.string().describe("The user's name"),
        email: z.string().email().describe("The user's email address"),
        message: z.string().describe("The message content"),
        subject: z.string().optional().describe("Optional subject line"),
    }),
    func: async ({ name, email, message, subject }) => {
        try {
            console.log(`[ContactTool] Processing message from ${email}`);

            const finalSubject = subject || "Message from Chatbot";

            // 1. Save to Database
            const contact = await prisma.contact.create({
                data: {
                    name,
                    email,
                    subject: finalSubject,
                    message,
                    source: "chatbot",
                },
            });

            const adminEmail = process.env.EMAIL_USER;

            const adminHtml = await render(
                <AdminTemplate
                    name={name}
                    email={email}
                    subject={finalSubject}
                    message={message}
                    date={new Date().toLocaleString()}
                />
            );

            await sendMail({
                to: adminEmail,
                subject: `[Chatbot Contact] ${finalSubject}`,
                html: adminHtml,
                text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
            });

            // 3. Send Acknowledgment to User
            const userHtml = await render(
                <ContactReplyEmail
                    customerName={name}
                />
            );

            await sendMail({
                to: email,
                subject: "Acknowledgment: Message Received // GreenHacker AI",
                html: userHtml,
                text: "We have received your message via our AI Assistant. Stand by."
            });

            return `Contact form submitted successfully! Reference ID: ${contact.id}. Tell the user you have sent their message to Harsh.`;

        } catch (error) {
            console.error("[ContactTool] Error:", error);
            return `Failed to submit contact form. Error: ${error.message}`;
        }
    },
});
