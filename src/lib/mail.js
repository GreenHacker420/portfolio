import { getGraphClient } from "@/lib/graph";

// Use Graph API instead of SMTP for better reliability with O365
export const sendMail = async ({ to, subject, html, text }) => {
    try {
        const client = await getGraphClient();
        const emailUser = process.env.EMAIL_USER; // The sender address

        if (!emailUser) {
            throw new Error("EMAIL_USER env var is missing");
        }

        const sendMailPayload = {
            message: {
                subject: subject,
                body: {
                    contentType: "HTML",
                    content: html || text // Prefer HTML, fallback to text
                },
                from: {
                    emailAddress: {
                        address: emailUser
                    }
                },
                toRecipients: [
                    {
                        emailAddress: {
                            address: to
                        }
                    }
                ]
            },
            saveToSentItems: "true"
        };

        // If 'to' is the same as 'from', it's an internal notification. 
        // Graph API allows sending to self.

        await client.api(`/users/${emailUser}/sendMail`)
            .post(sendMailPayload);

        console.log(`Email sent via Graph API to ${to}`);
        return { success: true };
    } catch (error) {
        console.error('Error sending email via Graph API:', error);
        // Fallback or re-throw? Re-throw for now so caller knows.
        throw error;
    }
};
