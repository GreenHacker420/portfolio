import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client'

// Create a direct Prisma client instance to avoid type conflicts
const directPrisma = new PrismaClient();
import { generateContactReply, ContactMessage } from '@/services/geminiService';
import { z } from 'zod';

const contactReplySchema = z.object({
  contactId: z.string(),
  mode: z.enum(['auto-generate', 'enhance-draft']),
  draftReply: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = contactReplySchema.parse(body);
    const { contactId, mode, draftReply } = validatedData;

    // Fetch the contact from database
    const contact = await directPrisma.contact.findUnique({
      where: { id: contactId }
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Validate draft reply for enhance mode
    if (mode === 'enhance-draft' && !draftReply) {
      return NextResponse.json(
        { error: 'Draft reply is required for enhance mode' },
        { status: 400 }
      );
    }

    // Prepare contact message data
    const contactMessage: ContactMessage = {
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
      createdAt: contact.createdAt.toISOString(),
    };

    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';

    // Generate AI reply
    const result = await generateContactReply(
      contactMessage,
      mode,
      draftReply,
      `reply-${session.user.id}-${clientIP}`
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate reply' },
        { status: 500 }
      );
    }

    // Log the AI generation action
    await directPrisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'AI_GENERATE',
        resource: 'contact_reply',
        resourceId: contactId,
        newData: JSON.stringify({
          mode,
          hasContent: !!result.content,
          usage: result.usage,
          timestamp: new Date().toISOString()
        }),
      }
    });

    return NextResponse.json({
      success: true,
      reply: result.content,
      usage: result.usage,
      mode
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Contact reply AI error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
