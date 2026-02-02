
import { NextResponse } from "next/server";

export async function GET(req) {
    // Return mock data for now to fix UI if Graph API is failing
    const mockEmails = [
        {
            id: "mock1",
            subject: "Welcome to your new portfolio",
            from: { emailAddress: { name: "System", address: "admin@system.local" } },
            bodyPreview: "This is a test email to verify the dashboard works even if Graph API fails.",
            receivedDateTime: new Date().toISOString(),
            isRead: false,
            body: { content: "<h1>Hello!</h1><p>Your dashboard is working.</p>" }
        }
    ];

    return NextResponse.json({ messages: mockEmails });
}

export async function POST(req) {
    return NextResponse.json({ success: true });
}
