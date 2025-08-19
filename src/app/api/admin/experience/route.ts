import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

// Create a direct Prisma client instance to avoid type conflicts
const directPrisma = new PrismaClient()
import { z } from 'zod'

const experienceSchema = z.object({
  company: z.string().min(1).max(100),
  position: z.string().min(1).max(100),
  startDate: z.string(),
  endDate: z.string().optional(),
  description: z.string().optional(),
  companyLogo: z.string().url().optional().or(z.literal('')),
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
        { company: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [experiences, totalCount] = await Promise.all([
      directPrisma.workExperience.findMany({
        where,
        orderBy: [
          { displayOrder: 'asc' },
          { startDate: 'desc' }
        ],
        skip,
        take: limit,
      }),
      directPrisma.workExperience.count({ where })
    ])

    return NextResponse.json({
      experiences,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: skip + experiences.length < totalCount,
        hasPrevPage: page > 1,
        limit,
      }
    })
  } catch (error) {
    console.error('Error fetching work experiences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch work experiences' },
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
    const validatedData = experienceSchema.parse(body)

    // Convert date strings to Date objects and ensure required fields
    const experienceData = {
      company: validatedData.company,
      position: validatedData.position,
      startDate: new Date(validatedData.startDate),
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
      description: validatedData.description || null,
      companyLogo: validatedData.companyLogo || null,
      isVisible: validatedData.isVisible ?? true,
      displayOrder: validatedData.displayOrder ?? 0,
    }

    const experience = await directPrisma.workExperience.create({
      data: experienceData
    })

    // Log the action
    await directPrisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE',
        resource: 'experience',
        resourceId: experience.id,
        newData: JSON.stringify(experience),
      }
    })

    return NextResponse.json({ experience }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating work experience:', error)
    return NextResponse.json(
      { error: 'Failed to create work experience' },
      { status: 500 }
    )
  }
}
