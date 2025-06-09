import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const educationUpdateSchema = z.object({
  institution: z.string().min(1).max(100).optional(),
  degree: z.string().min(1).max(100).optional(),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
  honors: z.string().optional(),
  isVisible: z.boolean().optional(),
  displayOrder: z.number().optional(),
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

    const education = await prisma.education.findUnique({
      where: { id: params.id }
    })

    if (!education) {
      return NextResponse.json({ error: 'Education not found' }, { status: 404 })
    }

    return NextResponse.json({ education })
  } catch (error) {
    console.error('Error fetching education:', error)
    return NextResponse.json(
      { error: 'Failed to fetch education' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = educationUpdateSchema.parse(body)

    // Check if education exists
    const existingEducation = await prisma.education.findUnique({
      where: { id: params.id }
    })

    if (!existingEducation) {
      return NextResponse.json({ error: 'Education not found' }, { status: 404 })
    }

    // Convert date strings to Date objects if provided
    const updateData: any = { ...validatedData }
    if (validatedData.startDate) {
      updateData.startDate = new Date(validatedData.startDate)
    }
    if (validatedData.endDate) {
      updateData.endDate = new Date(validatedData.endDate)
    }

    const education = await prisma.education.update({
      where: { id: params.id },
      data: updateData
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE',
        resource: 'education',
        resourceId: education.id,
        oldData: JSON.stringify(existingEducation),
        newData: JSON.stringify(education),
      }
    })

    return NextResponse.json({ education })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating education:', error)
    return NextResponse.json(
      { error: 'Failed to update education' },
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

    // Check if education exists
    const existingEducation = await prisma.education.findUnique({
      where: { id: params.id }
    })

    if (!existingEducation) {
      return NextResponse.json({ error: 'Education not found' }, { status: 404 })
    }

    await prisma.education.delete({
      where: { id: params.id }
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE',
        resource: 'education',
        resourceId: params.id,
        oldData: JSON.stringify(existingEducation),
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting education:', error)
    return NextResponse.json(
      { error: 'Failed to delete education' },
      { status: 500 }
    )
  }
}
