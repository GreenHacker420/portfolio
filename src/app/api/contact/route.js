
import { sendMail } from "@/lib/mail";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

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

        // Send Email
        const mailOptions = {
            to: process.env.EMAIL_USER, // Send to yourself
            subject: `New Contact Form: ${subject || "No Subject"}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
            html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
        };

        await sendMail(mailOptions);

        return NextResponse.json({ success: true, contactId: contact.id });
    } catch (error) {
        console.error("Contact Form Error Details:", error);
        return NextResponse.json({ error: "Failed to send message", details: error.message }, { status: 500 });
    }
}
