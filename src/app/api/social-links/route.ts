import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const socialLinks = await prisma.socialLink.findMany({
      where: { isVisible: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        platform: true,
        username: true,
        url: true,
        displayOrder: true
      }
    })

    return NextResponse.json({
      success: true,
      socialLinks
    })
  } catch (error) {
    console.error('Error fetching social links:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social links' },
      { status: 500 }
    )
  }
}
