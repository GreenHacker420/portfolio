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

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const experiences = await directPrisma.workExperience.findMany({
      orderBy: [
        { displayOrder: 'asc' },
        { startDate: 'desc' }
      ]
    })

    return NextResponse.json({ experiences })
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
