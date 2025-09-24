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
      title: z.string().max(120).optional().or(z.literal('')),
      description: z.string().max(300).optional().or(z.literal('')),
      keywords: z.array(z.string()).optional(),
      ogTitle: z.string().max(120).optional().or(z.literal('')),
      ogDescription: z.string().max(300).optional().or(z.literal('')),
      ogImage: z.string().url().optional().or(z.literal('')),
      twitterCard: z.enum(['summary', 'summary_large_image']).optional(),
      twitterSite: z.string().optional().or(z.literal('')),
      twitterCreator: z.string().optional().or(z.literal('')),
      canonicalUrl: z.string().url().optional().or(z.literal('')),
      robots: z.string().optional().or(z.literal('')),
      author: z.string().optional().or(z.literal('')),
      language: z.string().optional().or(z.literal('')),
      themeColor: z.string().optional().or(z.literal('')),
    })
    .optional(),
  features: z
    .object({
      enableBlog: z.boolean().optional(),
      enableContactAutoReply: z.boolean().optional(),
      enableDarkMode: z.boolean().optional(),
      enableAnalytics: z.boolean().optional(),
      enableChatbot: z.boolean().optional(),
    })
    .optional(),
  contact: z
    .object({
      email: z.string().email().optional().or(z.literal('')),
      phone: z.string().optional().or(z.literal('')),
      location: z.string().optional().or(z.literal('')),
      availability: z.string().optional().or(z.literal('')),
    })
    .optional(),
  social: z
    .object({
      github: z.string().url().optional().or(z.literal('')),
      linkedin: z.string().url().optional().or(z.literal('')),
      twitter: z.string().url().optional().or(z.literal('')),
      instagram: z.string().url().optional().or(z.literal('')),
      youtube: z.string().url().optional().or(z.literal('')),
      website: z.string().url().optional().or(z.literal('')),
    })
    .optional(),
  emailTemplates: z
    .object({
      contactReply: z.string().optional().or(z.literal('')),
      welcomeMessage: z.string().optional().or(z.literal('')),
      signature: z.string().optional().or(z.literal('')),
    })
    .optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const rows = await prisma.systemSettings.findMany({ orderBy: { key: 'asc' } })
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
      seo: data.seo ?? { 
        title: '',
        description: '', 
        keywords: [],
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        twitterCard: 'summary',
        twitterSite: '',
        twitterCreator: '',
        canonicalUrl: '',
        robots: 'index, follow',
        author: '',
        language: 'en',
        themeColor: '#000000'
      },
      features: data.features ?? { 
        enableBlog: false, 
        enableContactAutoReply: false, 
        enableDarkMode: true,
        enableAnalytics: false,
        enableChatbot: true
      },
      contact: data.contact ?? {
        email: '',
        phone: '',
        location: '',
        availability: ''
      },
      social: data.social ?? {
        github: '',
        linkedin: '',
        twitter: '',
        instagram: '',
        youtube: '',
        website: ''
      },
      emailTemplates: data.emailTemplates ?? {
        contactReply: '',
        welcomeMessage: '',
        signature: ''
      }
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
      { key: 'seo', value: JSON.stringify(validated.seo ?? {}) },
      { key: 'features', value: JSON.stringify(validated.features ?? {}) },
      { key: 'contact', value: JSON.stringify(validated.contact ?? {}) },
      { key: 'social', value: JSON.stringify(validated.social ?? {}) },
      { key: 'emailTemplates', value: JSON.stringify(validated.emailTemplates ?? {}) },
    ]

    for (const row of upserts) {
      await prisma.systemSettings.upsert({
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

