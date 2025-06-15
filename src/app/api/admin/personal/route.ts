import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

// Create a direct Prisma client instance to avoid type conflicts
const directPrisma = new PrismaClient()
import { z } from 'zod'

const personalInfoSchema = z.object({
  fullName: z.string().min(1).max(100),
  title: z.string().min(1).max(100),
  bio: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  profilePhoto: z.string().url().optional().or(z.literal('')),
  resumeUrl: z.string().url().optional().or(z.literal('')),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the first (and should be only) personal info record
    const personalInfo = await directPrisma.personalInfo.findFirst()

    return NextResponse.json({ personalInfo })
  } catch (error) {
    console.error('Error fetching personal info:', error)
    return NextResponse.json(
      { error: 'Failed to fetch personal information' },
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
    const validatedData = personalInfoSchema.parse(body)

    // Check if personal info already exists
    const existingInfo = await directPrisma.personalInfo.findFirst()

    if (existingInfo) {
      return NextResponse.json(
        { error: 'Personal information already exists. Use PUT to update.' },
        { status: 400 }
      )
    }

    // Prepare data for creation and ensure required fields
    const personalInfoData = {
      fullName: validatedData.fullName,
      title: validatedData.title,
      email: validatedData.email,
      phone: validatedData.phone || null,
      location: validatedData.location || null,
      bio: validatedData.bio || null,
      profilePhoto: validatedData.profilePhoto || null,
      resumeUrl: validatedData.resumeUrl || null,
    }

    const personalInfo = await directPrisma.personalInfo.create({
      data: personalInfoData
    })

    // Log the action
    await directPrisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE',
        resource: 'personal_info',
        resourceId: personalInfo.id,
        newData: JSON.stringify(personalInfo),
      }
    })

    return NextResponse.json({ personalInfo }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating personal info:', error)
    return NextResponse.json(
      { error: 'Failed to create personal information' },
      { status: 500 }
    )
  }
}
