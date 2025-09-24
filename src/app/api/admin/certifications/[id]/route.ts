import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

// Create a direct Prisma client instance to avoid type conflicts
const directPrisma = new PrismaClient()

const certificationUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  issuer: z.string().min(1).max(100).optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
  logo: z.string().url().optional().or(z.literal('')),
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
    const certification = await directPrisma.certification.findUnique({
      where: { id }
    })

    if (!certification) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 })
    }

    return NextResponse.json({ certification })
  } catch (error) {
    console.error('Error fetching certification:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certification' },
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
    const validatedData = certificationUpdateSchema.parse(body)

    // Check if certification exists
    const existingCertification = await directPrisma.certification.findUnique({
      where: { id }
    })

    if (!existingCertification) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {}
    
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.issuer !== undefined) updateData.issuer = validatedData.issuer
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.credentialId !== undefined) updateData.credentialId = validatedData.credentialId
    if (validatedData.isVisible !== undefined) updateData.isVisible = validatedData.isVisible
    if (validatedData.displayOrder !== undefined) updateData.displayOrder = validatedData.displayOrder
    
    if (validatedData.issueDate !== undefined) {
      updateData.issueDate = new Date(validatedData.issueDate)
    }
    if (validatedData.expiryDate !== undefined) {
      updateData.expiryDate = validatedData.expiryDate ? new Date(validatedData.expiryDate) : null
    }
    if (validatedData.credentialUrl !== undefined) {
      updateData.credentialUrl = validatedData.credentialUrl || null
    }
    if (validatedData.logo !== undefined) {
      updateData.logo = validatedData.logo || null
    }

    const certification = await directPrisma.certification.update({
      where: { id },
      data: updateData
    })

    // Log the action
    await directPrisma.audit_logs.create({
      data: {
        id: 'audit-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        userId: session.user.id,
        action: 'UPDATE',
        resource: 'certification',
        resourceId: id,
        oldData: JSON.stringify(existingCertification),
        newData: JSON.stringify(certification),
      }
    })

    return NextResponse.json({ certification })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating certification:', error)
    return NextResponse.json(
      { error: 'Failed to update certification' },
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
    // Check if certification exists
    const existingCertification = await directPrisma.certification.findUnique({
      where: { id }
    })

    if (!existingCertification) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 })
    }

    await directPrisma.certification.delete({
      where: { id }
    })

    // Log the action
    await directPrisma.audit_logs.create({
      data: {
        id: 'audit-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        userId: session.user.id,
        action: 'DELETE',
        resource: 'certification',
        resourceId: id,
        oldData: JSON.stringify(existingCertification),
      }
    })

    return NextResponse.json({ message: 'Certification deleted successfully' })
  } catch (error) {
    console.error('Error deleting certification:', error)
    return NextResponse.json(
      { error: 'Failed to delete certification' },
      { status: 500 }
    )
  }
}
