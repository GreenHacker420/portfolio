import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const personalInfo = await prisma.personalInfo.findFirst({
      orderBy: { updatedAt: 'desc' }
    })

    if (!personalInfo) {
      return NextResponse.json({
        success: false,
        error: 'Personal information not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      personalInfo
    })
  } catch (error) {
    console.error('Error fetching personal info:', error)
    return NextResponse.json(
      { error: 'Failed to fetch personal information' },
      { status: 500 }
    )
  }
}
