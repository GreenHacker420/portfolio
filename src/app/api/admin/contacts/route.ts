import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

// Create a direct Prisma client instance to avoid type conflicts
const directPrisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Calculate offset
    const offset = (page - 1) * limit

    // Get contacts with pagination
    const [contacts, totalCount] = await Promise.all([
      directPrisma.contact.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: offset,
        take: limit,
      }),
      directPrisma.contact.count({ where })
    ])

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      contacts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit
      }
    })

  } catch (error) {
    console.error('Contacts fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

// Export contacts data (CSV format)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, filters } = body

    if (action === 'export') {
      // Build where clause for export
      const where: any = {}
      
      if (filters?.status && filters.status !== 'all') {
        where.status = filters.status
      }
      
      if (filters?.dateFrom) {
        where.createdAt = { gte: new Date(filters.dateFrom) }
      }
      
      if (filters?.dateTo) {
        where.createdAt = { 
          ...where.createdAt,
          lte: new Date(filters.dateTo) 
        }
      }

      const contacts = await directPrisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      })

      // Convert to CSV format (no IP column in schema)
      const csvHeader = 'ID,Name,Email,Subject,Message,Status,Priority,Source,Created At,Updated At\n'
      const csvRows = contacts.map(contact => {
        const escapeCsv = (str: string) => `"${str.replace(/"/g, '""')}"`
        return [
          contact.id,
          escapeCsv(contact.name),
          escapeCsv(contact.email),
          escapeCsv(contact.subject),
          escapeCsv(contact.message),
          contact.status,
          contact.priority,
          contact.source || '',
          contact.createdAt.toISOString(),
          contact.updatedAt.toISOString()
        ].join(',')
      }).join('\n')

      const csvContent = csvHeader + csvRows

      // Log the export action
      await directPrisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'EXPORT',
          resource: 'contacts',
          newData: JSON.stringify({ 
            exportedCount: contacts.length,
            filters 
          }),
        }
      })

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="contacts-export-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Contacts export error:', error)
    return NextResponse.json(
      { error: 'Failed to export contacts' },
      { status: 500 }
    )
  }
}
