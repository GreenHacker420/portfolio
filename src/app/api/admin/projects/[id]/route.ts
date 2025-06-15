import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

// Create a direct Prisma client instance to avoid type conflicts
const directPrisma = new PrismaClient()
import { z } from 'zod'

const projectUpdateSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).optional(),
  longDescription: z.string().optional(),
  category: z.string().min(1).optional(),
  technologies: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  featured: z.boolean().optional(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
  screenshots: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  highlights: z.array(z.string()).optional(),
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
    const project = await directPrisma.project.findUnique({
      where: { id }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Parse JSON fields
    const projectWithParsedData = {
      ...project,
      technologies: project.technologies ? JSON.parse(project.technologies) : [],
      screenshots: project.screenshots ? JSON.parse(project.screenshots) : [],
      highlights: project.highlights ? JSON.parse(project.highlights) : [],
    }

    return NextResponse.json({ project: projectWithParsedData })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
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
    const validatedData = projectUpdateSchema.parse(body)

    // Check if project exists
    const existingProject = await directPrisma.project.findUnique({
      where: { id }
    })

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {}
    
    if (validatedData.title !== undefined) updateData.title = validatedData.title
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.longDescription !== undefined) updateData.longDescription = validatedData.longDescription
    if (validatedData.category !== undefined) updateData.category = validatedData.category
    if (validatedData.status !== undefined) updateData.status = validatedData.status
    if (validatedData.featured !== undefined) updateData.featured = validatedData.featured
    if (validatedData.displayOrder !== undefined) updateData.displayOrder = validatedData.displayOrder
    
    if (validatedData.technologies !== undefined) {
      updateData.technologies = JSON.stringify(validatedData.technologies)
    }
    if (validatedData.screenshots !== undefined) {
      updateData.screenshots = JSON.stringify(validatedData.screenshots)
    }
    if (validatedData.highlights !== undefined) {
      updateData.highlights = JSON.stringify(validatedData.highlights)
    }
    
    if (validatedData.githubUrl !== undefined) {
      updateData.githubUrl = validatedData.githubUrl || null
    }
    if (validatedData.liveUrl !== undefined) {
      updateData.liveUrl = validatedData.liveUrl || null
    }
    if (validatedData.imageUrl !== undefined) {
      updateData.imageUrl = validatedData.imageUrl || null
    }
    
    if (validatedData.startDate !== undefined) {
      updateData.startDate = validatedData.startDate ? new Date(validatedData.startDate) : null
    }
    if (validatedData.endDate !== undefined) {
      updateData.endDate = validatedData.endDate ? new Date(validatedData.endDate) : null
    }

    const project = await directPrisma.project.update({
      where: { id },
      data: updateData
    })

    // Log the action
    await directPrisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE',
        resource: 'projects',
        resourceId: project.id,
        oldData: JSON.stringify(existingProject),
        newData: JSON.stringify(project),
      }
    })

    // Parse JSON fields for response
    const projectWithParsedData = {
      ...project,
      technologies: project.technologies ? JSON.parse(project.technologies) : [],
      screenshots: project.screenshots ? JSON.parse(project.screenshots) : [],
      highlights: project.highlights ? JSON.parse(project.highlights) : [],
    }

    return NextResponse.json({ project: projectWithParsedData })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
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
    // Check if project exists
    const existingProject = await directPrisma.project.findUnique({
      where: { id }
    })

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    await directPrisma.project.delete({
      where: { id }
    })

    // Log the action
    await directPrisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE',
        resource: 'projects',
        resourceId: id,
        oldData: JSON.stringify(existingProject),
      }
    })

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
