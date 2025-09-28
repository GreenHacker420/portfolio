import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

// Create a direct Prisma client instance to avoid type conflicts
const directPrisma = new PrismaClient()

const emailTemplateUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  subject: z.string().min(1).max(200).optional(),
  htmlContent: z.string().min(1).optional(),
  textContent: z.string().optional(),
  variables: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
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
    const template = await directPrisma.emailTemplate.findUnique({
      where: { id }
    })

    if (!template) {
      return NextResponse.json({ error: 'Email template not found' }, { status: 404 })
    }

    // Parse JSON fields
    const templateWithParsedData = {
      ...template,
      variables: template.variables ? JSON.parse(template.variables) : [],
    }

    return NextResponse.json({ template: templateWithParsedData })
  } catch (error) {
    console.error('Error fetching email template:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email template' },
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
    const validatedData = emailTemplateUpdateSchema.parse(body)

    // Get the current template for audit log
    const currentTemplate = await directPrisma.emailTemplate.findUnique({
      where: { id }
    })

    if (!currentTemplate) {
      return NextResponse.json({ error: 'Email template not found' }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = { ...validatedData }
    if (validatedData.variables !== undefined) {
      updateData.variables = JSON.stringify(validatedData.variables)
    }

    const template = await directPrisma.emailTemplate.update({
      where: { id },
      data: updateData
    })

    // Log the action
    await directPrisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE',
        resource: 'email_templates',
        resourceId: template.id,
        oldData: JSON.stringify(currentTemplate),
        newData: JSON.stringify(template),
      }
    })

    // Parse JSON fields for response
    const templateWithParsedData = {
      ...template,
      variables: template.variables ? JSON.parse(template.variables) : [],
    }

    return NextResponse.json({ template: templateWithParsedData })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating email template:', error)
    return NextResponse.json(
      { error: 'Failed to update email template' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    // Get the current template for audit log
    const currentTemplate = await directPrisma.emailTemplate.findUnique({
      where: { id }
    })

    if (!currentTemplate) {
      return NextResponse.json({ error: 'Email template not found' }, { status: 404 })
    }

    await directPrisma.emailTemplate.delete({
      where: { id }
    })

    // Log the action
    await directPrisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE',
        resource: 'email_templates',
        resourceId: id,
        oldData: JSON.stringify(currentTemplate),
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting email template:', error)
    return NextResponse.json(
      { error: 'Failed to delete email template' },
      { status: 500 }
    )
  }
}
