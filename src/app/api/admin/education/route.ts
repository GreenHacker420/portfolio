import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

// Create a direct Prisma client instance to avoid type conflicts
const directPrisma = new PrismaClient()
import { z } from 'zod'

const educationSchema = z.object({
  institution: z.string().min(1).max(100),
  degree: z.string().min(1).max(100),
  fieldOfStudy: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
  honors: z.string().optional(),
  isVisible: z.boolean().default(true),
  displayOrder: z.number().default(0),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const education = await directPrisma.education.findMany({
      orderBy: [
        { displayOrder: 'asc' },
        { startDate: 'desc' }
      ]
    })

    return NextResponse.json({ education })
  } catch (error) {
    console.error('Error fetching education:', error)
    return NextResponse.json(
      { error: 'Failed to fetch education' },
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
    const validatedData = educationSchema.parse(body)

    // Convert date strings to Date objects and ensure required fields
    const educationData = {
      institution: validatedData.institution,
      degree: validatedData.degree,
      fieldOfStudy: validatedData.fieldOfStudy || null,
      startDate: new Date(validatedData.startDate),
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
      gpa: validatedData.gpa || null,
      honors: validatedData.honors || null,
      isVisible: validatedData.isVisible ?? true,
      displayOrder: validatedData.displayOrder ?? 0,
    }

    const education = await directPrisma.education.create({
      data: educationData
    })

    // Log the action
    await directPrisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE',
        resource: 'education',
        resourceId: education.id,
        newData: JSON.stringify(education),
      }
    })

    return NextResponse.json({ education }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Education create error:', error)
    return NextResponse.json(
      { error: 'Failed to create education' },
      { status: 500 }
    )
  }
}
