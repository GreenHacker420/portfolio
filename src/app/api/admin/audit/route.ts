import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

// Create a direct Prisma client instance to avoid type conflicts
const directPrisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit
    const action = searchParams.get('action')
    const resource = searchParams.get('resource')
    const search = searchParams.get('search')

    const where: any = {}
    if (action && action !== 'all') where.action = action
    if (resource && resource !== 'all') where.resource = resource
    if (search) {
      where.OR = [
        { resource: { contains: search, mode: 'insensitive' } },
        { resourceId: { contains: search, mode: 'insensitive' } },
        { oldData: { contains: search, mode: 'insensitive' } },
        { newData: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [logs, totalCount] = await Promise.all([
      directPrisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
        skip,
        take: limit,
      }),
      directPrisma.auditLog.count({ where })
    ])

    return NextResponse.json({
      logs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: skip + logs.length < totalCount,
        hasPrevPage: page > 1,
        limit,
      }
    })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    )
  }
}
