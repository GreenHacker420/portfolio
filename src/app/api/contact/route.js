
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import nodemailer from 'nodemailer';
import { z } from 'zod';

// Zod Schema
const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
    message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use host/port from env
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function POST(request) {
    try {
        const body = await request.json();

        // Validate
        const validationResult = contactSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.errors[0].message },
                { status: 400 }
            );
        }

        const { name, email, subject, message } = validationResult.data;

        // Save to DB
        const contact = await prisma.contact.create({
            data: {
                name,
                email,
                subject,
                message,
                status: 'pending',
            },
        });

        // Send Email Notification (to Admin)
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: process.env.EMAIL_USER, // Send to self
                    subject: `New Contact: ${subject}`,
                    html: `
            <h3>New Message from Portfolio</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <pre>${message}</pre>
          `,
                });

                // Auto-reply (to User)
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: `Received: ${subject}`,
                    html: `
              <h3>Hi ${name},</h3>
              <p>Thanks for reaching out! I've received your message and will get back to you soon.</p>
              <br/>
              <p>Best regards,</p>
              <p>GreenHacker</p>
            `,
                });
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
                // Continue, don't fail the request just because email failed
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Message sent successfully!',
            id: contact.id,
        });

    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
