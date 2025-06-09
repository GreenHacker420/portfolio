import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const logs = await prisma.auditLog.findMany({
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

    // Create CSV content
    const csvHeaders = ['Date', 'Time', 'Action', 'Resource', 'Resource ID', 'Old Data', 'New Data', 'User Name', 'User Email']
    const csvRows = logs.map(log => [
      new Date(log.createdAt).toLocaleDateString(),
      new Date(log.createdAt).toLocaleTimeString(),
      log.action,
      log.resource,
      log.resourceId || '',
      log.oldData ? `"${log.oldData.replace(/"/g, '""')}"` : '', // Escape quotes
      log.newData ? `"${log.newData.replace(/"/g, '""')}"` : '', // Escape quotes
      log.user.name,
      log.user.email
    ])

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n')

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error) {
    console.error('Error exporting audit logs:', error)
    return NextResponse.json(
      { error: 'Failed to export audit logs' },
      { status: 500 }
    )
  }
}
