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

    // Get recent audit logs
    const activities = await directPrisma.auditLog.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // Format activities for frontend
    const formattedActivities = activities.map(activity => ({
      id: activity.id,
      action: activity.action,
      entity: activity.resource,
      entityId: activity.resourceId,
      createdAt: activity.createdAt.toISOString(),
      user: activity.user.name || activity.user.email
    }))

    return NextResponse.json({
      activities: formattedActivities
    })
  } catch (error) {
    console.error('Error fetching dashboard activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}
