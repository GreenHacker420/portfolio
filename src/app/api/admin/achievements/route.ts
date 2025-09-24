import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

// Create a direct Prisma client instance to avoid type conflicts
const directPrisma = new PrismaClient()

const achievementSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  category: z.string().min(1).max(100),
  date: z.string().min(1),
  issuer: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
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
    const category = searchParams.get('category')

    const where: any = {}
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { issuer: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (category) {
      where.category = category
    }

    const [achievements, totalCount] = await Promise.all([
      directPrisma.achievement.findMany({
        where,
        orderBy: [
          { displayOrder: 'asc' },
          { date: 'desc' }
        ],
        skip,
        take: limit,
      }),
      directPrisma.achievement.count({ where })
    ])

    return NextResponse.json({
      achievements,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: skip + achievements.length < totalCount,
        hasPrevPage: page > 1,
        limit,
      }
    })
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
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
    const validatedData = achievementSchema.parse(body)

    // Prepare achievement data for database
    const achievementData = {
      title: validatedData.title,
      description: validatedData.description,
      category: validatedData.category,
      date: new Date(validatedData.date),
      issuer: validatedData.issuer || null,
      url: validatedData.url || null,
      imageUrl: validatedData.imageUrl || null,
      isVisible: validatedData.isVisible ?? true,
      displayOrder: validatedData.displayOrder ?? 0,
    }

    const achievement = await directPrisma.achievement.create({
      data: achievementData
    })

    await directPrisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE',
        resource: 'achievement',
        resourceId: achievement.id,
        newData: JSON.stringify(achievement),
      }
    })

    return NextResponse.json({ achievement }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating achievement:', error)
    return NextResponse.json(
      { error: 'Failed to create achievement' },
      { status: 500 }
    )
  }
}