import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

// Create a direct Prisma client instance to avoid type conflicts
const directPrisma = new PrismaClient()

const certificationSchema = z.object({
  name: z.string().min(1).max(200),
  issuer: z.string().min(1).max(100),
  issueDate: z.string().min(1),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
  skills: z.array(z.string()).optional(),
  isVisible: z.boolean().default(true),
  displayOrder: z.number().default(0),
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
    const search = searchParams.get('search')

    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { issuer: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [certifications, totalCount] = await Promise.all([
      directPrisma.certification.findMany({
        where,
        orderBy: [
          { displayOrder: 'asc' },
          { issueDate: 'desc' }
        ],
        skip,
        take: limit,
      }),
      directPrisma.certification.count({ where })
    ])

    // Parse JSON fields for response
    const certificationsWithParsedData = certifications.map(cert => ({
      ...cert,
      skills: cert.skills ? JSON.parse(cert.skills) : [],
    }))

    return NextResponse.json({
      certifications: certificationsWithParsedData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: skip + certifications.length < totalCount,
        hasPrevPage: page > 1,
        limit,
      }
    })
  } catch (error) {
    console.error('Error fetching certifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certifications' },
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
    const validatedData = certificationSchema.parse(body)

    // Prepare certification data for database
    const certificationData = {
      name: validatedData.name,
      issuer: validatedData.issuer,
      issueDate: new Date(validatedData.issueDate),
      expiryDate: validatedData.expiryDate ? new Date(validatedData.expiryDate) : null,
      credentialId: validatedData.credentialId || null,
      credentialUrl: validatedData.credentialUrl || null,
      description: validatedData.description || null,
      skills: validatedData.skills ? JSON.stringify(validatedData.skills) : null,
      isVisible: validatedData.isVisible ?? true,
      displayOrder: validatedData.displayOrder ?? 0,
    }

    const certification = await directPrisma.certification.create({
      data: certificationData
    })

    // TODO: Fix audit logging - temporarily disabled due to schema mismatch
    await directPrisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: 'CREATE',
        resource: 'certification',
        resourceId: certification.id,
        newData: JSON.stringify(certification),
      }
    })

    // Parse JSON fields for response
    const certificationWithParsedData = {
      ...certification,
      skills: certification.skills ? JSON.parse(certification.skills) : [],
    }

    return NextResponse.json({ certification: certificationWithParsedData }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating certification:', error)
    return NextResponse.json(
      { error: 'Failed to create certification' },
      { status: 500 }
    )
  }
}
