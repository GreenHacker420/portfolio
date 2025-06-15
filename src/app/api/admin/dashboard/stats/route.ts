import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

// Create a direct Prisma client instance to avoid type conflicts
const directPrisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get counts from database
    const [
      totalSkills,
      totalProjects,
      publishedProjects,
      draftProjects,
      recentActivity
    ] = await Promise.all([
      directPrisma.skill.count(),
      directPrisma.project.count(),
      directPrisma.project.count({ where: { status: 'published' } }),
      directPrisma.project.count({ where: { status: 'draft' } }),
      directPrisma.auditLog.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      })
    ])

    return NextResponse.json({
      totalSkills,
      totalProjects,
      publishedProjects,
      draftProjects,
      recentActivity
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
