import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const socialLinkSchema = z.object({
  platform: z.string().min(1).max(50),
  url: z.string().url(),
  username: z.string().optional(),
  icon: z.string().optional(),
  isVisible: z.boolean().default(true),
  displayOrder: z.number().default(0),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const socialLinks = await prisma.socialLink.findMany({
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ socialLinks })
  } catch (error) {
    console.error('Error fetching social links:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social links' },
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
    const validatedData = socialLinkSchema.parse(body)

    const socialLink = await prisma.socialLink.create({
      data: validatedData
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE',
        resource: 'social_links',
        resourceId: socialLink.id,
        newData: JSON.stringify(socialLink),
      }
    })

    return NextResponse.json({ socialLink }, { status: 201 })
  } catch (error) {
    console.error('Error creating social link:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create social link' },
      { status: 500 }
    )
  }
}
