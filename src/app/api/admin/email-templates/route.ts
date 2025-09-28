import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

// Create a direct Prisma client instance to avoid type conflicts
const directPrisma = new PrismaClient()

const emailTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  subject: z.string().min(1).max(200),
  htmlContent: z.string().min(1),
  textContent: z.string().optional(),
  variables: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  description: z.string().optional(),
  category: z.string().default('contact'),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where: any = {}
    if (category && category !== 'all') where.category = category
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [templates, totalCount] = await Promise.all([
      directPrisma.emailTemplate.findMany({
        where,
        orderBy: [
          { category: 'asc' },
          { name: 'asc' }
        ],
        skip,
        take: limit,
      }),
      directPrisma.emailTemplate.count({ where })
    ])

    // Parse JSON fields for response
    const templatesWithParsedData = templates.map(template => ({
      ...template,
      variables: template.variables ? JSON.parse(template.variables) : [],
    }))

    return NextResponse.json({
      templates: templatesWithParsedData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: skip + templates.length < totalCount,
        hasPrevPage: page > 1,
        limit,
      }
    })
  } catch (error) {
    console.error('Error fetching email templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email templates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = emailTemplateSchema.parse(body)

    // Convert arrays to JSON strings for storage
    const templateData = {
      name: validatedData.name,
      subject: validatedData.subject,
      htmlContent: validatedData.htmlContent,
      textContent: validatedData.textContent || null,
      variables: validatedData.variables ? JSON.stringify(validatedData.variables) : null,
      isActive: validatedData.isActive ?? true,
      description: validatedData.description || null,
      category: validatedData.category || 'contact',
    }

    const template = await directPrisma.emailTemplate.create({
      data: templateData
    })

    // Log the action
    await directPrisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE',
        resource: 'email_templates',
        resourceId: template.id,
        newData: JSON.stringify(template),
      }
    })

    // Parse JSON fields for response
    const templateWithParsedData = {
      ...template,
      variables: template.variables ? JSON.parse(template.variables) : [],
    }

    return NextResponse.json({ template: templateWithParsedData }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating email template:', error)
    return NextResponse.json(
      { error: 'Failed to create email template' },
      { status: 500 }
    )
  }
}
