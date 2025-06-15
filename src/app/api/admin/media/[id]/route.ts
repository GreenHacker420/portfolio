import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

// Create a direct Prisma client instance to avoid type conflicts
const directPrisma = new PrismaClient()

const mediaUpdateSchema = z.object({
  alt: z.string().optional(),
  category: z.string().optional(),
  isVisible: z.boolean().optional(),
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
    const media = await directPrisma.media.findUnique({
      where: { id }
    })

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    return NextResponse.json({ media })
  } catch (error) {
    console.error('Media fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media' },
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
    const validatedData = mediaUpdateSchema.parse(body)

    // Check if media exists
    const existingMedia = await directPrisma.media.findUnique({
      where: { id }
    })

    if (!existingMedia) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    const media = await directPrisma.media.update({
      where: { id },
      data: validatedData
    })

    // Log the action
    await directPrisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE',
        resource: 'media',
        resourceId: media.id,
        oldData: JSON.stringify(existingMedia),
        newData: JSON.stringify(media),
      }
    })

    return NextResponse.json({ media })
  } catch (error) {
    console.error('Media update error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update media' },
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
    // Check if media exists
    const existingMedia = await directPrisma.media.findUnique({
      where: { id }
    })

    if (!existingMedia) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    // TODO: Delete the actual file from storage
    // This would depend on your storage solution (local, S3, etc.)

    await directPrisma.media.delete({
      where: { id }
    })

    // Log the action
    await directPrisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE',
        resource: 'media',
        resourceId: id,
        oldData: JSON.stringify(existingMedia),
      }
    })

    return NextResponse.json({ message: 'Media deleted successfully' })
  } catch (error) {
    console.error('Media deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    )
  }
}
