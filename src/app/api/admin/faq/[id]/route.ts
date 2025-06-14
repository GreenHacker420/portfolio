import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const directPrisma = new PrismaClient();

const faqUpdateSchema = z.object({
  question: z.string().min(5).max(500).optional(),
  answer: z.string().min(10).max(5000).optional(),
  category: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  isVisible: z.boolean().optional(),
  displayOrder: z.number().optional()
});

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const faq = await directPrisma.fAQ.findUnique({
      where: { id: params.id }
    });

    if (!faq) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      faq: {
        ...faq,
        tags: faq.tags ? JSON.parse(faq.tags) : []
      }
    });
  } catch (error) {
    console.error('FAQ fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQ' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = faqUpdateSchema.parse(body);

    // Get the current FAQ for audit log
    const currentFAQ = await directPrisma.fAQ.findUnique({
      where: { id: params.id }
    });

    if (!currentFAQ) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = { ...validatedData };
    if (validatedData.tags) {
      updateData.tags = JSON.stringify(validatedData.tags);
    }

    const faq = await directPrisma.fAQ.update({
      where: { id: params.id },
      data: updateData
    });

    // Log the action
    await directPrisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE',
        resource: 'faqs',
        resourceId: faq.id,
        oldData: JSON.stringify(currentFAQ),
        newData: JSON.stringify(faq),
      }
    });

    return NextResponse.json({ 
      faq: {
        ...faq,
        tags: faq.tags ? JSON.parse(faq.tags) : []
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('FAQ update error:', error);
    return NextResponse.json(
      { error: 'Failed to update FAQ' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the current FAQ for audit log
    const currentFAQ = await directPrisma.fAQ.findUnique({
      where: { id: params.id }
    });

    if (!currentFAQ) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    await directPrisma.fAQ.delete({
      where: { id: params.id }
    });

    // Log the action
    await directPrisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE',
        resource: 'faqs',
        resourceId: params.id,
        oldData: JSON.stringify(currentFAQ),
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('FAQ delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete FAQ' },
      { status: 500 }
    );
  }
}
