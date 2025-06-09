import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const personalInfoUpdateSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  title: z.string().min(1).max(100).optional(),
  bio: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  profilePhoto: z.string().url().optional().or(z.literal('')),
  resumeUrl: z.string().url().optional().or(z.literal('')),
})

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
    const validatedData = personalInfoUpdateSchema.parse(body)

    // Check if personal info exists
    const existingInfo = await prisma.personalInfo.findUnique({
      where: { id: params.id }
    })

    if (!existingInfo) {
      return NextResponse.json({ error: 'Personal information not found' }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {}
    
    if (validatedData.fullName !== undefined) updateData.fullName = validatedData.fullName
    if (validatedData.title !== undefined) updateData.title = validatedData.title
    if (validatedData.email !== undefined) updateData.email = validatedData.email
    if (validatedData.bio !== undefined) updateData.bio = validatedData.bio || null
    if (validatedData.phone !== undefined) updateData.phone = validatedData.phone || null
    if (validatedData.location !== undefined) updateData.location = validatedData.location || null
    if (validatedData.profilePhoto !== undefined) updateData.profilePhoto = validatedData.profilePhoto || null
    if (validatedData.resumeUrl !== undefined) updateData.resumeUrl = validatedData.resumeUrl || null

    const personalInfo = await prisma.personalInfo.update({
      where: { id: params.id },
      data: updateData
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'PersonalInfo',
        entityId: personalInfo.id,
        userId: session.user.id,
        details: `Updated personal information for ${personalInfo.fullName}`
      }
    })

    return NextResponse.json({ personalInfo })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating personal info:', error)
    return NextResponse.json(
      { error: 'Failed to update personal information' },
      { status: 500 }
    )
  }
}
