import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const skillSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().optional(),
  category: z.string().min(1),
  level: z.number().min(1).max(100),
  color: z.string().min(1),
  logo: z.string().optional(),
  experience: z.number().optional(),
  projects: z.array(z.string()).optional(),
  strengths: z.array(z.string()).optional(),
  displayOrder: z.number().default(0),
  isVisible: z.boolean().default(true),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const skills = await prisma.skill.findMany({
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json({ skills })

  } catch (error) {
    console.error('Skills fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
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
    const validatedData = skillSchema.parse(body)

    // Convert arrays to JSON strings for storage
    const skillData = {
      ...validatedData,
      projects: validatedData.projects ? JSON.stringify(validatedData.projects) : null,
      strengths: validatedData.strengths ? JSON.stringify(validatedData.strengths) : null,
    }

    const skill = await prisma.skill.create({
      data: skillData
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE',
        resource: 'skills',
        resourceId: skill.id,
        newData: JSON.stringify(skill),
      }
    })

    return NextResponse.json({ skill }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Skills create error:', error)
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    )
  }
}
