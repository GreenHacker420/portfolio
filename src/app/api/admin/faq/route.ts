import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const directPrisma = new PrismaClient();

const faqCreateSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters').max(500, 'Question too long'),
  answer: z.string().min(10, 'Answer must be at least 10 characters').max(5000, 'Answer too long'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional(),
  isVisible: z.boolean().optional(),
  displayOrder: z.number().optional()
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'displayOrder';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Build where clause
    const where: any = {};
    
    if (category && category !== 'all') {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { answer: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    // Get FAQs with pagination
    const [faqs, totalCount] = await Promise.all([
      directPrisma.faq.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: offset,
        take: limit,
      }),
      directPrisma.faq.count({ where })
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      faqs: faqs.map(faq => ({
        ...faq,
        tags: faq.tags ? JSON.parse(faq.tags) : []
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit
      }
    });

  } catch (error) {
    console.error('Admin FAQ fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = faqCreateSchema.parse(body);

    const faq = await directPrisma.faq.create({
      data: {
        question: validatedData.question,
        answer: validatedData.answer,
        category: validatedData.category,
        tags: validatedData.tags ? JSON.stringify(validatedData.tags) : null,
        isVisible: validatedData.isVisible ?? true,
        displayOrder: validatedData.displayOrder ?? 0
      }
    });

    // Log the action
    await directPrisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE',
        resource: 'faqs',
        resourceId: faq.id,
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

    console.error('FAQ create error:', error);
    return NextResponse.json(
      { error: 'Failed to create FAQ' },
      { status: 500 }
    );
  }
}
