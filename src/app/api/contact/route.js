import { sendMail } from "@/lib/mail";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import ContactReplyEmail from "@/emails/ContactTemplate";
import AdminTemplate from "@/emails/AdminTemplate";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Save to Database
        const contact = await prisma.contact.create({
            data: {
                name,
                email,
                subject: subject || "No Subject",
                message,
                source: "website",
            },
        });

        const adminEmail = process.env.EMAIL_USER;

        // 1. Send Notification to Admin
        const adminHtml = await render(
            <AdminTemplate
                name={name}
                email={email}
                subject={subject || "No Subject"}
                message={message}
                date={new Date().toLocaleString()}
            />
        );

        await sendMail({
            to: adminEmail,
            subject: `[New Contact] ${subject || "No Subject"}`,
            html: adminHtml,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        });

        // 2. Send Acknowledgment to User
        const userHtml = await render(
            <ContactReplyEmail
                customerName={name}
            />
        );

        await sendMail({
            to: email,
            subject: "Transmission Received // GreenHacker",
            html: userHtml,
            text: "We have received your message. Stand by."
        });

        return NextResponse.json({ success: true, contactId: contact.id });
    } catch (error) {
        console.error("Contact Form Error Details:", error);
        return NextResponse.json({ error: "Failed to send message", details: error.message }, { status: 500 });
    }
}
