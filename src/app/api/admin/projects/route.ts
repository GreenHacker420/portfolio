import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const projectSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  longDescription: z.string().optional(),
  category: z.string().min(1),
  technologies: z.array(z.string()),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured: z.boolean().default(false),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
  screenshots: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  displayOrder: z.number().default(0),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    // Parse JSON fields
    const projectsWithParsedData = projects.map(project => ({
      ...project,
      technologies: project.technologies ? JSON.parse(project.technologies) : [],
      screenshots: project.screenshots ? JSON.parse(project.screenshots) : [],
      highlights: project.highlights ? JSON.parse(project.highlights) : [],
    }))

    return NextResponse.json({ projects: projectsWithParsedData })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
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
    const validatedData = projectSchema.parse(body)

    // Convert arrays to JSON strings for storage
    const projectData = {
      ...validatedData,
      technologies: JSON.stringify(validatedData.technologies),
      screenshots: validatedData.screenshots ? JSON.stringify(validatedData.screenshots) : null,
      highlights: validatedData.highlights ? JSON.stringify(validatedData.highlights) : null,
      startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
      githubUrl: validatedData.githubUrl || null,
      liveUrl: validatedData.liveUrl || null,
      imageUrl: validatedData.imageUrl || null,
    }

    const project = await prisma.project.create({
      data: projectData
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE',
        resource: 'projects',
        resourceId: project.id,
        newData: JSON.stringify(project),
      }
    })

    // Parse JSON fields for response
    const projectWithParsedData = {
      ...project,
      technologies: JSON.parse(project.technologies),
      screenshots: project.screenshots ? JSON.parse(project.screenshots) : [],
      highlights: project.highlights ? JSON.parse(project.highlights) : [],
    }

    return NextResponse.json({ project: projectWithParsedData }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
