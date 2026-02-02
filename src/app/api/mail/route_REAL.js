
import { getGraphClient } from "@/lib/graph";
import { NextResponse } from "next/server";

const TARGET_EMAIL = "harsh@greenhacker.in";

export async function GET(req) {
    try {
        const client = await getGraphClient();
        const headers = new Headers(req.headers);
        // Simple pagination optional query params could be added here

        // Fetch messages from Inbox
        // $top=20, $select=subject,from,bodyPreview,receivedDateTime,isRead
        const result = await client
            .api(`/users/${TARGET_EMAIL}/mailFolders/inbox/messages`)
            .top(20)
            .select("id,subject,from,bodyPreview,receivedDateTime,isRead,body")
            .orderby("receivedDateTime DESC")
            .get();

        return NextResponse.json({ messages: result.value });
    } catch (error) {
        console.error("Graph API Get Error Details:", JSON.stringify(error, null, 2));
        return NextResponse.json({ error: "Failed to fetch emails", details: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { messageId, comment } = await req.json();

        if (!messageId || !comment) {
            return NextResponse.json({ error: "Missing messageId or comment" }, { status: 400 });
        }

        const client = await getGraphClient();

        // Create Reply
        const reply = {
            comment: comment,
        };

        // Send the reply
        await client
            .api(`/users/${TARGET_EMAIL}/messages/${messageId}/reply`)
            .post(reply);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Graph API Reply Error:", error);
        return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
    }
}
