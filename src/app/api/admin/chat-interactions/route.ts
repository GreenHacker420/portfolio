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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const sessionId = searchParams.get('sessionId')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (sessionId) {
      where.sessionId = sessionId
    }

    if (search) {
      where.OR = [
        { userMessage: { contains: search, mode: 'insensitive' } },
        { botResponse: { contains: search, mode: 'insensitive' } },
        { sessionId: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get total count
    const total = await prisma.chatInteraction.count({ where })

    // Get interactions
    const interactions = await prisma.chatInteraction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        sessionId: true,
        userMessage: true,
        botResponse: true,
        responseTime: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Get session statistics
    const sessionStats = await prisma.chatInteraction.groupBy({
      by: ['sessionId'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 10
    })

    return NextResponse.json({
      success: true,
      interactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      sessionStats: sessionStats.map(stat => ({
        sessionId: stat.sessionId,
        messageCount: stat._count.id
      }))
    })

  } catch (error) {
    console.error('Chat interactions fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat interactions' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const sessionId = searchParams.get('sessionId')
    const olderThan = searchParams.get('olderThan') // ISO date string

    if (!id && !sessionId && !olderThan) {
      return NextResponse.json(
        { error: 'Either id, sessionId, or olderThan parameter is required' },
        { status: 400 }
      )
    }

    let deleted
    let auditData: any = {}

    if (id) {
      // Delete single interaction
      deleted = await prisma.chatInteraction.delete({
        where: { id }
      })
      auditData = { id, type: 'single' }
    } else if (sessionId) {
      // Delete all interactions for a session
      deleted = await prisma.chatInteraction.deleteMany({
        where: { sessionId }
      })
      auditData = { sessionId, type: 'session', count: deleted.count }
    } else if (olderThan) {
      // Delete interactions older than specified date
      const cutoffDate = new Date(olderThan)
      deleted = await prisma.chatInteraction.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          }
        }
      })
      auditData = { olderThan, type: 'bulk_cleanup', count: deleted.count }
    }

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: 'DELETE',
        resource: 'chat_interactions',
        oldData: JSON.stringify(auditData)
      }
    })

    return NextResponse.json({
      success: true,
      deleted: deleted.count || 1,
      type: auditData.type
    })

  } catch (error) {
    console.error('Chat interactions delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete chat interactions' },
      { status: 500 }
    )
  }
}
