import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

// Create a direct Prisma client instance to avoid type conflicts
const directPrisma = new PrismaClient()

const contactUpdateSchema = z.object({
  status: z.enum(['pending', 'responded', 'archived']).optional()
})

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const contact = await directPrisma.contact.findUnique({
      where: { id }
    })

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    return NextResponse.json({ contact })
  } catch (error) {
    console.error('Contact fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    )
  }
}

export async function PATCH(
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
    const validatedData = contactUpdateSchema.parse(body)

    // Get the current contact for audit log
    const currentContact = await directPrisma.contact.findUnique({
      where: { id }
    })

    if (!currentContact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    const contact = await directPrisma.contact.update({
      where: { id },
      data: validatedData
    })

    // Log the action
    await directPrisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE',
        resource: 'contacts',
        resourceId: contact.id,
        oldData: JSON.stringify(currentContact),
        newData: JSON.stringify(contact),
      }
    })

    return NextResponse.json({ contact })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Contact update error:', error)
    return NextResponse.json(
      { error: 'Failed to update contact' },
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
    // Get the current contact for audit log
    const currentContact = await directPrisma.contact.findUnique({
      where: { id }
    })

    if (!currentContact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    await directPrisma.contact.delete({
      where: { id }
    })

    // Log the action
    await directPrisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE',
        resource: 'contacts',
        resourceId: id,
        oldData: JSON.stringify(currentContact),
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}
