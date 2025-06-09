import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendContactEmails } from '@/services/emailService';
import { z } from 'zod';

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5; // 5 requests per 15 minutes

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  const limit = rateLimitMap.get(ip);
  if (now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (limit.count >= maxRequests) {
    return true;
  }

  limit.count++;
  return false;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please provide a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200, 'Subject must be less than 200 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message must be less than 2000 characters'),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate input using Zod
    const validationResult = contactSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message).join(', ');
      return NextResponse.json(
        { error: errors },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validationResult.data;
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
      ipAddress: ip,
      userAgent: userAgent,
    };

    // Save to database
    const contact = await prisma.contact.create({
      data: {
        name: sanitizedData.name,
        email: sanitizedData.email,
        subject: sanitizedData.subject,
        message: sanitizedData.message,
        ipAddress: sanitizedData.ipAddress,
        userAgent: sanitizedData.userAgent,
        status: 'pending',
      },
    });

    // Send emails (auto-reply and notification)
    const emailResults = await sendContactEmails(sanitizedData);

    // Log email results
    console.log('Contact form submission saved:', contact.id);
    console.log('Email results:', emailResults);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! I\'ll get back to you soon.',
      id: contact.id,
      emailSent: emailResults.autoReply || emailResults.notification
    });

  } catch (error) {
    console.error('Contact form error:', error);

    // Check if it's a Zod validation error
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

// Remove the old sendEmail function as we're using the new email service

export async function GET() {
  return NextResponse.json(
    { message: 'Contact API endpoint is working!' },
    { status: 200 }
  );
}
