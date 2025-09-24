import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeHidden = searchParams.get('includeHidden') === 'true'
    const category = searchParams.get('category')

    const where: any = {}
    if (!includeHidden) {
      where.isVisible = true
    }
    if (category) {
      where.category = category
    }

    const achievements = await prisma.achievement.findMany({
      where,
      orderBy: [
        { displayOrder: 'asc' },
        { date: 'desc' }
      ],
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        displayOrder: true,
      }
    })

    return NextResponse.json({ achievements })
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    )
  }
}

