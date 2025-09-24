import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeHidden = searchParams.get('includeHidden') === 'true'

    const where: any = {}
    if (!includeHidden) {
      where.isVisible = true
    }

    const experiences = await prisma.workExperience.findMany({
      where,
      orderBy: [
        { displayOrder: 'asc' },
        { startDate: 'desc' }
      ],
      select: {
        id: true,
        company: true,
        position: true,
        startDate: true,
        endDate: true,
        description: true,
        companyLogo: true,
        displayOrder: true,
      }
    })

    return NextResponse.json({ experiences })
  } catch (error) {
    console.error('Error fetching work experiences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch work experiences' },
      { status: 500 }
    )
  }
}
