import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

// Create a direct Prisma client instance to avoid type conflicts
const directPrisma = new PrismaClient()

const achievementUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  isVisible: z.boolean().optional(),
  displayOrder: z.number().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const achievement = await directPrisma.achievement.findUnique({
      where: { id }
    })

    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 })
    }

    return NextResponse.json({ achievement })
  } catch (error) {
    console.error('Error fetching achievement:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievement' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = achievementUpdateSchema.parse(body)

    // Check if achievement exists
    const existingAchievement = await directPrisma.achievement.findUnique({
      where: { id }
    })

    if (!existingAchievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {}
    
    if (validatedData.title !== undefined) updateData.title = validatedData.title
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.date !== undefined) updateData.date = validatedData.date
    if (validatedData.isVisible !== undefined) updateData.isVisible = validatedData.isVisible
    if (validatedData.displayOrder !== undefined) updateData.displayOrder = validatedData.displayOrder

    const achievement = await directPrisma.achievement.update({
      where: { id },
      data: updateData
    })

    // TODO: Fix audit logging - temporarily disabled
    // await directPrisma.audit_logs.create({
    //   data: {
    //     userId: session.user.id,
    //     action: 'UPDATE',
    //     resource: 'achievement',
    //     resourceId: achievement.id,
    //     oldData: JSON.stringify(existingAchievement),
    //     newData: JSON.stringify(achievement),
    //   }
    // })

    return NextResponse.json({ achievement })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating achievement:', error)
    return NextResponse.json(
      { error: 'Failed to update achievement' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    // Check if achievement exists
    const existingAchievement = await directPrisma.achievement.findUnique({
      where: { id }
    })

    if (!existingAchievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 })
    }

    await directPrisma.achievement.delete({
      where: { id }
    })

    // TODO: Fix audit logging - temporarily disabled
    // await directPrisma.audit_logs.create({
    //   data: {
    //     userId: session.user.id,
    //     action: 'DELETE',
    //     resource: 'achievement',
    //     resourceId: id,
    //     oldData: JSON.stringify(existingAchievement),
    //   }
    // })

    return NextResponse.json({ message: 'Achievement deleted successfully' })
  } catch (error) {
    console.error('Error deleting achievement:', error)
    return NextResponse.json(
      { error: 'Failed to delete achievement' },
      { status: 500 }
    )
  }
}
