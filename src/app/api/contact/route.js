import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import prisma from '@/lib/db';

export async function POST(req) {
    try {
        const { name, email, projectType, message } = await req.json();

        // Basic validation
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Save to Database
        try {
            await prisma.contact.create({
                data: {
                    name,
                    email,
                    message,
                    subject: projectType ? `Project Inquiry: ${projectType}` : 'General Inquiry',
                    inquiryType: projectType ? 'PROJECT' : 'GENERAL',
                    phone: 'N/A', // Schema requires phone? No, it's optional? Let's check schema. phone String? -> Optional.
                    source: 'portfolio-contact-form',
                    status: 'pending'
                }
            });
        } catch (dbError) {
            console.error('Failed to save contact to DB:', dbError);
            // We continue to send email even if DB fails, or should we warn?
            // Logging is enough for now.
        }

        // Configure transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Email content
        const mailOptions = {
            from: process.env.SMTP_FROM || '"Portfolio Contact" <no-reply@example.com>',
            to: process.env.CONTACT_EMAIL || process.env.SMTP_USER, // Send to yourself
            subject: `New Portfolio Inquiry from ${name}`,
            text: `
                Name: ${name}
                Email: ${email}
                Project Type: ${projectType || 'Not specified'}
                
                Message:
                ${message}
            `,
            html: `
                <h3>New Portfolio Inquiry</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Project Type:</strong> ${projectType || 'Not specified'}</p>
                <br/>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `,
        };

        // Send email (only if creds exist, else log)
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            await transporter.sendMail(mailOptions);
            return NextResponse.json({ success: true, message: 'Email sent successfully' });
        } else {
            console.log('Dev Mode - Email Data:', mailOptions);
            // Simulate success in dev if no creds
            return NextResponse.json({ success: true, message: 'Dev mode: Email logged to console' });
        }

    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
