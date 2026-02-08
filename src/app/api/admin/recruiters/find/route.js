import { findRecruiterEmails, verifyEmail } from "@/lib/osint/recruiter";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { domain } = await req.json();
        if (!domain) return NextResponse.json({ error: "domain required" }, { status: 400 });
        const emails = await findRecruiterEmails(domain);
        const verified = await Promise.all(emails.map(verifyEmail));
        return NextResponse.json({ emails: verified });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
