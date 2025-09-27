import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

// Create a direct Prisma client instance to avoid type conflicts
const directPrisma = new PrismaClient()
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
  gallery: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  challenges: z.array(z.string()).optional(),
  learnings: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  teamSize: z.number().optional(),
  role: z.string().optional(),
  displayOrder: z.number().default(0),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}
    if (status && status !== 'all') where.status = status
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [projects, totalCount] = await Promise.all([
      directPrisma.project.findMany({
        where,
        orderBy: [
          { displayOrder: 'asc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      directPrisma.project.count({ where })
    ])

    // Parse JSON fields
    const projectsWithParsedData = projects.map(project => ({
      ...project,
      technologies: project.technologies ? JSON.parse(project.technologies) : [],
      gallery: project.gallery ? JSON.parse(project.gallery) : [],
      highlights: project.highlights ? JSON.parse(project.highlights) : [],
      challenges: project.challenges ? JSON.parse(project.challenges) : [],
      learnings: project.learnings ? JSON.parse(project.learnings) : [],
    }))

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      projects: projectsWithParsedData,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      }
    })
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

    // Convert arrays to JSON strings for storage and ensure required fields
    const projectData = {
      title: validatedData.title,
      description: validatedData.description,
      longDescription: validatedData.longDescription || null,
      category: validatedData.category,
      status: validatedData.status ?? 'draft',
      featured: validatedData.featured ?? false,
      displayOrder: validatedData.displayOrder ?? 0,
      technologies: JSON.stringify(validatedData.technologies || []),
      gallery: validatedData.gallery ? JSON.stringify(validatedData.gallery) : JSON.stringify([]),
      highlights: validatedData.highlights ? JSON.stringify(validatedData.highlights) : JSON.stringify([]),
      challenges: validatedData.challenges ? JSON.stringify(validatedData.challenges) : JSON.stringify([]),
      learnings: validatedData.learnings ? JSON.stringify(validatedData.learnings) : JSON.stringify([]),
      startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
      teamSize: validatedData.teamSize || null,
      role: validatedData.role || null,
      githubUrl: validatedData.githubUrl || null,
      liveUrl: validatedData.liveUrl || null,
      imageUrl: validatedData.imageUrl || null,
    }

    const project = await directPrisma.project.create({
      data: projectData
    })

    // Log the action
    await directPrisma.auditLog.create({
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
      gallery: project.gallery ? JSON.parse(project.gallery) : [],
      highlights: project.highlights ? JSON.parse(project.highlights) : [],
      challenges: project.challenges ? JSON.parse(project.challenges) : [],
      learnings: project.learnings ? JSON.parse(project.learnings) : [],
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
