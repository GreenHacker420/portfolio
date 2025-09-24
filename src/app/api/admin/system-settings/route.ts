import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { CacheManager } from '@/lib/cache'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await prisma.systemSettings.findMany({
      orderBy: { key: 'asc' }
    })

    // Transform to key-value object for easier frontend usage
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = {
        id: setting.id,
        value: setting.value,
        description: setting.description,
        updatedAt: setting.updatedAt
      }
      return acc
    }, {} as Record<string, any>)

    return NextResponse.json({
      success: true,
      settings: settingsObject,
      raw: settings
    })

  } catch (error) {
    console.error('System settings fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch system settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { key, value, description } = await request.json()

    if (!key || !value) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      )
    }

    const setting = await prisma.systemSettings.upsert({
      where: { key },
      update: {
        value,
        description: description || undefined,
        updatedAt: new Date()
      },
      create: {
        key,
        value,
        description: description || undefined
      }
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: 'CREATE_OR_UPDATE',
        resource: 'system_settings',
        resourceId: setting.id,
        newData: JSON.stringify({ key, value, description })
      }
    })

    // Invalidate relevant caches
    CacheManager.invalidateAll()

    return NextResponse.json({
      success: true,
      setting
    })

  } catch (error) {
    console.error('System settings create/update error:', error)
    return NextResponse.json(
      { error: 'Failed to create/update system setting' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { settings } = await request.json()

    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { error: 'Settings must be an array' },
        { status: 400 }
      )
    }

    // Bulk update settings
    const updatedSettings = []
    for (const { key, value, description } of settings) {
      if (key && value !== undefined) {
        const setting = await prisma.systemSettings.upsert({
          where: { key },
          update: {
            value,
            description: description || undefined,
            updatedAt: new Date()
          },
          create: {
            key,
            value,
            description: description || undefined
          }
        })
        updatedSettings.push(setting)
      }
    }

    // Log the bulk action
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: 'BULK_UPDATE',
        resource: 'system_settings',
        newData: JSON.stringify({ count: updatedSettings.length, settings })
      }
    })

    // Invalidate relevant caches
    CacheManager.invalidateAll()

    return NextResponse.json({
      success: true,
      updated: updatedSettings.length,
      settings: updatedSettings
    })

  } catch (error) {
    console.error('System settings bulk update error:', error)
    return NextResponse.json(
      { error: 'Failed to bulk update system settings' },
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
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json(
        { error: 'Key parameter is required' },
        { status: 400 }
      )
    }

    const deleted = await prisma.systemSettings.delete({
      where: { key }
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: 'DELETE',
        resource: 'system_settings',
        resourceId: deleted.id,
        oldData: JSON.stringify(deleted)
      }
    })

    // Invalidate relevant caches
    CacheManager.invalidateAll()

    return NextResponse.json({
      success: true,
      deleted
    })

  } catch (error) {
    console.error('System settings delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete system setting' },
      { status: 500 }
    )
  }
}
