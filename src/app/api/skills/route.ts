import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Create a direct Prisma client instance to avoid type conflicts
const directPrisma = new PrismaClient()

export async function GET() {
  try {
    const skills = await directPrisma.skill.findMany({
      where: {
        isVisible: true
      },
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' }
      ],
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        level: true,
        color: true,
        logo: true,
        experience: true,
        projects: true,
        strengths: true,
        displayOrder: true,
        isVisible: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    // Transform the data to match frontend expectations
    const transformedSkills = skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      description: skill.description || '',
      logo: skill.logo || '',
      color: skill.color,
      experience: skill.experience || 0,
      proficiency: skill.level, // Map level to proficiency for backward compatibility
      level: skill.level,
      projects: skill.projects ? JSON.parse(skill.projects) : [],
      strengths: skill.strengths ? JSON.parse(skill.strengths) : [],
      category: skill.category as 'frontend' | 'backend' | 'language' | 'database' | 'devops' | 'mobile' | 'design' | 'other',
      displayOrder: skill.displayOrder,
      isVisible: skill.isVisible,
      createdAt: skill.createdAt,
      updatedAt: skill.updatedAt,
    }))

    return NextResponse.json({ 
      skills: transformedSkills,
      total: transformedSkills.length 
    })

  } catch (error) {
    console.error('Skills fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    )
  }
}

// Cache the response for 5 minutes
export const revalidate = 300
