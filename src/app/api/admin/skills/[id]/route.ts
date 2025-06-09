import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const skillUpdateSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().optional(),
  category: z.string().min(1).optional(),
  level: z.number().min(1).max(100).optional(),
  color: z.string().min(1).optional(),
  logo: z.string().optional(),
  experience: z.number().optional(),
  projects: z.array(z.string()).optional(),
  strengths: z.array(z.string()).optional(),
  displayOrder: z.number().optional(),
  isVisible: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const skill = await prisma.skill.findUnique({
      where: { id: params.id }
    })

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }

    // Parse JSON fields
    const skillWithParsedData = {
      ...skill,
      projects: skill.projects ? JSON.parse(skill.projects) : [],
      strengths: skill.strengths ? JSON.parse(skill.strengths) : [],
    }

    return NextResponse.json({ skill: skillWithParsedData })
  } catch (error) {
    console.error('Skill fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skill' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = skillUpdateSchema.parse(body)

    // Get the current skill for audit log
    const currentSkill = await prisma.skill.findUnique({
      where: { id: params.id }
    })

    if (!currentSkill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }

    // Convert arrays to JSON strings for storage
    const updateData = {
      ...validatedData,
      projects: validatedData.projects ? JSON.stringify(validatedData.projects) : undefined,
      strengths: validatedData.strengths ? JSON.stringify(validatedData.strengths) : undefined,
    }

    const skill = await prisma.skill.update({
      where: { id: params.id },
      data: updateData
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE',
        resource: 'skills',
        resourceId: skill.id,
        oldData: JSON.stringify(currentSkill),
        newData: JSON.stringify(skill),
      }
    })

    return NextResponse.json({ skill })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Skill update error:', error)
    return NextResponse.json(
      { error: 'Failed to update skill' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the current skill for audit log
    const currentSkill = await prisma.skill.findUnique({
      where: { id: params.id }
    })

    if (!currentSkill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }

    await prisma.skill.delete({
      where: { id: params.id }
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE',
        resource: 'skills',
        resourceId: params.id,
        oldData: JSON.stringify(currentSkill),
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Skill delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    )
  }
}