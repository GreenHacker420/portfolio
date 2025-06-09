import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const experienceUpdateSchema = z.object({
  company: z.string().min(1).max(100).optional(),
  position: z.string().min(1).max(100).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
  companyLogo: z.string().url().optional().or(z.literal('')),
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

    const experience = await prisma.workExperience.findUnique({
      where: { id: params.id }
    })

    if (!experience) {
      return NextResponse.json({ error: 'Work experience not found' }, { status: 404 })
    }

    return NextResponse.json({ experience })
  } catch (error) {
    console.error('Error fetching work experience:', error)
    return NextResponse.json(
      { error: 'Failed to fetch work experience' },
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
    const validatedData = experienceUpdateSchema.parse(body)

    // Check if experience exists
    const existingExperience = await prisma.workExperience.findUnique({
      where: { id: params.id }
    })

    if (!existingExperience) {
      return NextResponse.json({ error: 'Work experience not found' }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {}
    
    if (validatedData.company !== undefined) updateData.company = validatedData.company
    if (validatedData.position !== undefined) updateData.position = validatedData.position
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.isVisible !== undefined) updateData.isVisible = validatedData.isVisible
    if (validatedData.displayOrder !== undefined) updateData.displayOrder = validatedData.displayOrder
    
    if (validatedData.startDate !== undefined) {
      updateData.startDate = new Date(validatedData.startDate)
    }
    if (validatedData.endDate !== undefined) {
      updateData.endDate = validatedData.endDate ? new Date(validatedData.endDate) : null
    }
    if (validatedData.companyLogo !== undefined) {
      updateData.companyLogo = validatedData.companyLogo || null
    }

    const experience = await prisma.workExperience.update({
      where: { id: params.id },
      data: updateData
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE',
        resource: 'experience',
        resourceId: experience.id,
        oldData: JSON.stringify(existingExperience),
        newData: JSON.stringify(experience),
      }
    })

    return NextResponse.json({ experience })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating work experience:', error)
    return NextResponse.json(
      { error: 'Failed to update work experience' },
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

    // Check if experience exists
    const existingExperience = await prisma.workExperience.findUnique({
      where: { id: params.id }
    })

    if (!existingExperience) {
      return NextResponse.json({ error: 'Work experience not found' }, { status: 404 })
    }

    await prisma.workExperience.delete({
      where: { id: params.id }
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE',
        resource: 'experience',
        resourceId: params.id,
        oldData: JSON.stringify(existingExperience),
      }
    })

    return NextResponse.json({ message: 'Work experience deleted successfully' })
  } catch (error) {
    console.error('Error deleting work experience:', error)
    return NextResponse.json(
      { error: 'Failed to delete work experience' },
      { status: 500 }
    )
  }
}
