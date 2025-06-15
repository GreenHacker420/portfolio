import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client'

// Create a direct Prisma client instance to avoid type conflicts
const directPrisma = new PrismaClient();
import { sendContactReply } from '@/services/emailService';
import { z } from 'zod';

const replySchema = z.object({
  replyMessage: z.string().min(10, 'Reply message must be at least 10 characters'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  isAiGenerated: z.boolean().default(false),
  aiMode: z.enum(['auto-generate', 'enhance-draft', 'manual']).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const body = await request.json();
    const validatedData = replySchema.parse(body);
    const { replyMessage, subject, isAiGenerated, aiMode } = validatedData;

    // Fetch the contact from database
    const contact = await directPrisma.contact.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Send the reply email
    const emailSent = await sendContactReply({
      to: contact.email,
      toName: contact.name,
      subject: subject,
      replyMessage: replyMessage,
      originalSubject: contact.subject,
      originalMessage: contact.message,
      senderName: session.user.name || 'Green Hacker',
      senderEmail: process.env.SMTP_USER || 'noreply@greenhacker.tech'
    });

    // Store the reply in database
    const reply = await directPrisma.contactReply.create({
      data: {
        contactId: contact.id,
        userId: session.user.id,
        subject: subject,
        message: replyMessage,
        isAiGenerated: isAiGenerated,
        aiMode: aiMode || 'manual',
        emailSent: emailSent,
      }
    });

    // Update contact status to 'responded'
    await directPrisma.contact.update({
      where: { id: resolvedParams.id },
      data: { status: 'responded' }
    });

    // Log the action
    await directPrisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'REPLY',
        resource: 'contacts',
        resourceId: contact.id,
        newData: JSON.stringify({
          replyId: reply.id,
          subject: subject,
          isAiGenerated: isAiGenerated,
          aiMode: aiMode,
          emailSent: emailSent,
          timestamp: new Date().toISOString()
        }),
      }
    });

    return NextResponse.json({
      success: true,
      reply: {
        id: reply.id,
        subject: reply.subject,
        message: reply.message,
        emailSent: reply.emailSent,
        createdAt: reply.createdAt
      },
      contactUpdated: true
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Contact reply send error:', error);
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    );
  }
}
