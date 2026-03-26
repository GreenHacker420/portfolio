
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { getGraphClient } from "@/lib/graph";

// Fallback mock data
const MOCK_EMAILS = [
    {
        id: "mock1",
        subject: "Welcome to your new portfolio (Mock)",
        from: { emailAddress: { name: "System", address: "admin@system.local" } },
        bodyPreview: "This is a fallback email because the Graph API connection failed or is not configured.",
        receivedDateTime: new Date().toISOString(),
        isRead: false,
        body: { content: "<h1>System Message</h1><p>Graph API is unavailable. Using mock data.</p>" }
    }
];

export const GET = withApiHandler(async (req) => {
    const emailUser = process.env.EMAIL_USER;
    if (!emailUser) {
        console.warn("EMAIL_USER env var missing, using mock data");
        return apiOk({ messages: MOCK_EMAILS });
    }

    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder") || "inbox";

    const folderMap = {
        "inbox": "inbox",
        "sent": "sentitems",
        "drafts": "drafts",
        "trash": "deleteditems",
        "archive": "archive",
        "junk": "junkemail"
    };

    const folderId = folderMap[folder] || "inbox";

    const client = await getGraphClient();
    // Use generic /messages for inbox if simple, or explicit folder path
    const endpoint = folder === "inbox"
        ? `/users/${emailUser}/messages`
        : `/users/${emailUser}/mailFolders/${folderId}/messages`;

    const messages = await client.api(endpoint)
        .select('id,subject,from,toRecipients,receivedDateTime,bodyPreview,body,isRead,categories')
        .top(25)
        .orderby('receivedDateTime DESC')
        .get();

    return apiOk({ messages: messages.value });
});

export const POST = withApiHandler(async (req) => {
    const payload = await req.json();
    const { messageId, comment, to, subject, body } = payload;
    const emailUser = process.env.EMAIL_USER;

    if (!emailUser) throw new Error("EMAIL_USER not configured");

    const client = await getGraphClient();

    if (messageId && comment) {
        // Case 1: Reply - use structured message to support HTML
        const replyMessage = {
            message: {
                body: {
                    contentType: "HTML",
                    content: comment
                }
            }
        };
        await client.api(`/users/${emailUser}/messages/${messageId}/reply`).post(replyMessage);
    } else if (to && subject && body) {
        // Case 2: Send a new email
        const sendMail = {
            message: {
                subject: subject,
                body: {
                    contentType: "HTML",
                    content: body
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
        await client.api(`/users/${emailUser}/sendMail`).post(sendMail);
    } else {
        throw new Error("Missing fields for reply or new mail");
    }

    return apiOk({ success: true });
});

export const PATCH = withApiHandler(async (req) => {
    const payload = await req.json();
    const { messageId, action, destination } = payload;
    const emailUser = process.env.EMAIL_USER;

    if (!emailUser) throw new Error("EMAIL_USER not configured");
    if (!messageId) throw new Error("messageId required");

    const client = await getGraphClient();

    if (action === "move" && destination) {
        const folderMap = {
            "trash": "deleteditems",
            "junk": "junkemail",
            "archive": "archive",
            "inbox": "inbox"
        };
        const destinationId = folderMap[destination] || destination;

        await client.api(`/users/${emailUser}/messages/${messageId}/move`)
            .post({ destinationId });

        return apiOk({ success: true });
    }

    throw new Error("Invalid action");
});
