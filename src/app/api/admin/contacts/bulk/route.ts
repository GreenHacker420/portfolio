import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { action, ids, payload } = await request.json() as { action: string; ids: string[]; payload?: any }
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 })
    }

    if (action === 'delete') {
      const deleted = await prisma.contact.deleteMany({ where: { id: { in: ids } } })
      await prisma.auditLog.create({ data: { userId: (session.user as any).id, action: 'BULK_DELETE', resource: 'contacts', newData: JSON.stringify({ ids }) } })
      return NextResponse.json({ success: true, deleted: deleted.count })
    }

    if (action === 'status') {
      const status = payload?.status as 'pending' | 'responded' | 'archived'
      if (!['pending', 'responded', 'archived'].includes(String(status))) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      }
      const updated = await prisma.contact.updateMany({ where: { id: { in: ids } }, data: { status } })
      await prisma.auditLog.create({ data: { userId: (session.user as any).id, action: 'BULK_UPDATE', resource: 'contacts', newData: JSON.stringify({ ids, status }) } })
      return NextResponse.json({ success: true, updated: updated.count })
    }

    if (action === 'export') {
      const rows = await prisma.contact.findMany({ where: { id: { in: ids } } })
      const csvHeader = 'ID,Name,Email,Subject,Status,Created At,Updated At\n'
      const csvRows = rows.map(r => [r.id, r.name, r.email, r.subject, r.status, r.createdAt.toISOString(), r.updatedAt.toISOString()].join(','))
      const csv = csvHeader + csvRows.join('\n')
      return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': `attachment; filename="contacts-export.csv"` } })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Contacts bulk error:', error)
    return NextResponse.json({ error: 'Failed to process bulk action' }, { status: 500 })
  }
}

