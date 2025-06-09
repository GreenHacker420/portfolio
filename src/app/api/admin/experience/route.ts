import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
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

    const experiences = await prisma.workExperience.findMany({
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

    // Convert date strings to Date objects
    const experienceData = {
      ...validatedData,
      startDate: new Date(validatedData.startDate),
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
      companyLogo: validatedData.companyLogo || null,
    }

    const experience = await prisma.workExperience.create({
      data: experienceData
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'WorkExperience',
        entityId: experience.id,
        userId: session.user.id,
        details: `Created work experience: ${experience.position} at ${experience.company}`
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
