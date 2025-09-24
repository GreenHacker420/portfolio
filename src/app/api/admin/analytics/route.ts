import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    // Get basic counts
    const [
      totalProjects,
      publishedProjects,
      totalSkills,
      visibleSkills,
      totalContacts,
      unreadContacts,
      totalChatInteractions,
      recentChatInteractions,
      totalAuditLogs,
      recentAuditLogs
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: 'published' } }),
      prisma.skill.count(),
      prisma.skill.count({ where: { isVisible: true } }),
      prisma.contact.count(),
      prisma.contact.count({ where: { status: 'unread' } }),
      prisma.chatInteraction.count(),
      prisma.chatInteraction.count({ where: { createdAt: { gte: cutoffDate } } }),
      prisma.auditLog.count(),
      prisma.auditLog.count({ where: { createdAt: { gte: cutoffDate } } })
    ])

    // Get contact trends (last 30 days)
    const contactTrends = await prisma.contact.groupBy({
      by: ['status'],
      _count: {
        id: true
      },
      where: {
        createdAt: { gte: cutoffDate }
      }
    })

    // Get chat interaction trends
    const chatTrends = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM chat_interactions 
      WHERE created_at >= ${cutoffDate}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    ` as Array<{ date: Date; count: bigint }>

    // Get most active skills (by project usage)
    const skillUsage = await prisma.skill.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        level: true,
        projects: true
      },
      where: { isVisible: true },
      orderBy: { level: 'desc' },
      take: 10
    })

    // Get recent admin activities
    const recentActivities = await prisma.auditLog.findMany({
      select: {
        id: true,
        action: true,
        resource: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    // Get project categories distribution
    const projectCategories = await prisma.project.groupBy({
      by: ['category'],
      _count: {
        id: true
      },
      where: {
        status: 'published'
      }
    })

    // Get skill categories distribution
    const skillCategories = await prisma.skill.groupBy({
      by: ['category'],
      _count: {
        id: true
      },
      where: {
        isVisible: true
      }
    })

    // Calculate growth metrics
    const previousPeriodCutoff = new Date(Date.now() - (days * 2) * 24 * 60 * 60 * 1000)
    const [
      previousContacts,
      previousChatInteractions
    ] = await Promise.all([
      prisma.contact.count({
        where: {
          createdAt: {
            gte: previousPeriodCutoff,
            lt: cutoffDate
          }
        }
      }),
      prisma.chatInteraction.count({
        where: {
          createdAt: {
            gte: previousPeriodCutoff,
            lt: cutoffDate
          }
        }
      })
    ])

    const contactGrowth = previousContacts > 0 
      ? ((unreadContacts - previousContacts) / previousContacts) * 100 
      : 0

    const chatGrowth = previousChatInteractions > 0 
      ? ((recentChatInteractions - previousChatInteractions) / previousChatInteractions) * 100 
      : 0

    return NextResponse.json({
      success: true,
      analytics: {
        overview: {
          totalProjects,
          publishedProjects,
          totalSkills,
          visibleSkills,
          totalContacts,
          unreadContacts,
          totalChatInteractions,
          recentChatInteractions,
          totalAuditLogs,
          recentAuditLogs
        },
        growth: {
          contactGrowth: Math.round(contactGrowth * 100) / 100,
          chatGrowth: Math.round(chatGrowth * 100) / 100,
          period: `${days} days`
        },
        trends: {
          contacts: contactTrends.map(trend => ({
            status: trend.status,
            count: trend._count.id
          })),
          chatInteractions: chatTrends.map(trend => ({
            date: trend.date,
            count: Number(trend.count)
          }))
        },
        distributions: {
          projectCategories: projectCategories.map(cat => ({
            category: cat.category,
            count: cat._count.id
          })),
          skillCategories: skillCategories.map(cat => ({
            category: cat.category,
            count: cat._count.id
          }))
        },
        topSkills: skillUsage.map(skill => ({
          id: skill.id,
          name: skill.name,
          category: skill.category,
          level: skill.level,
          projectCount: skill.projects ? JSON.parse(skill.projects).length : 0
        })),
        recentActivities: recentActivities.map(activity => ({
          id: activity.id,
          action: activity.action,
          resource: activity.resource,
          createdAt: activity.createdAt,
          user: activity.user?.name || activity.user?.email || 'Unknown'
        }))
      },
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
