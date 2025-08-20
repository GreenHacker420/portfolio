import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const settingsSchema = z.object({
  siteTitle: z.string().min(1).max(120),
  heroSubtitle: z.string().max(240).optional().or(z.literal('')),
  seo: z
    .object({
      description: z.string().max(300).optional().or(z.literal('')),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
  features: z
    .object({
      enableBlog: z.boolean().optional(),
      enableContactAutoReply: z.boolean().optional(),
      enableDarkMode: z.boolean().optional(),
    })
    .optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const rows = await prisma.setting.findMany({ orderBy: { key: 'asc' } })
    const data: Record<string, any> = {}
    for (const row of rows) {
      try {
        data[row.key] = JSON.parse(row.value)
      } catch {
        data[row.key] = row.value
      }
    }
    // Compose structured settings response
    const response = {
      siteTitle: data.siteTitle ?? 'Portfolio Admin',
      heroSubtitle: data.heroSubtitle ?? '',
      seo: data.seo ?? { description: '', keywords: [] },
      features: data.features ?? { enableBlog: false, enableContactAutoReply: false, enableDarkMode: true },
    }
    return NextResponse.json({ settings: response })
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const validated = settingsSchema.parse(body)

    const upserts = [
      { key: 'siteTitle', value: JSON.stringify(validated.siteTitle) },
      { key: 'heroSubtitle', value: JSON.stringify(validated.heroSubtitle ?? '') },
      { key: 'seo', value: JSON.stringify(validated.seo ?? { description: '', keywords: [] }) },
      { key: 'features', value: JSON.stringify(validated.features ?? { enableBlog: false, enableContactAutoReply: false, enableDarkMode: true }) },
    ]

    for (const row of upserts) {
      await prisma.setting.upsert({
        where: { key: row.key },
        create: row,
        update: { value: row.value },
      })
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: 'UPDATE',
        resource: 'settings',
        newData: JSON.stringify(validated),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Settings PUT error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}

