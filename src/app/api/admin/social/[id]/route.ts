import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

// Create a direct Prisma client instance to avoid type conflicts
const directPrisma = new PrismaClient()
import { z } from 'zod'

const socialLinkUpdateSchema = z.object({
  platform: z.string().min(1).max(50).optional(),
  url: z.string().url().optional(),
  username: z.string().optional(),
  icon: z.string().optional(),
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
    const socialLink = await directPrisma.socialLink.findUnique({
      where: { id }
    })

    if (!socialLink) {
      return NextResponse.json({ error: 'Social link not found' }, { status: 404 })
    }

    return NextResponse.json({ socialLink })
  } catch (error) {
    console.error('Social link fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social link' },
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
    const validatedData = socialLinkUpdateSchema.parse(body)

    // Check if social link exists
    const existingSocialLink = await directPrisma.socialLink.findUnique({
      where: { id }
    })

    if (!existingSocialLink) {
      return NextResponse.json({ error: 'Social link not found' }, { status: 404 })
    }

    const socialLink = await directPrisma.socialLink.update({
      where: { id },
      data: validatedData
    })

    // Log the action
    await directPrisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE',
        resource: 'social_links',
        resourceId: socialLink.id,
        oldData: JSON.stringify(existingSocialLink),
        newData: JSON.stringify(socialLink),
      }
    })

    return NextResponse.json({ socialLink })
  } catch (error) {
    console.error('Social link update error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update social link' },
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
    // Check if social link exists
    const existingSocialLink = await directPrisma.socialLink.findUnique({
      where: { id }
    })

    if (!existingSocialLink) {
      return NextResponse.json({ error: 'Social link not found' }, { status: 404 })
    }

    await directPrisma.socialLink.delete({
      where: { id }
    })

    // Log the action
    await directPrisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE',
        resource: 'social_links',
        resourceId: id,
        oldData: JSON.stringify(existingSocialLink),
      }
    })

    return NextResponse.json({ message: 'Social link deleted successfully' })
  } catch (error) {
    console.error('Social link deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete social link' },
      { status: 500 }
    )
  }
}
