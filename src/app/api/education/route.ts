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

    const education = await prisma.education.findMany({
      where,
      orderBy: [
        { displayOrder: 'asc' },
        { startDate: 'desc' }
      ],
      select: {
        id: true,
        institution: true,
        degree: true,
        fieldOfStudy: true,
        startDate: true,
        endDate: true,
        gpa: true,
        honors: true,
        displayOrder: true,
      }
    })

    return NextResponse.json({ education })
  } catch (error) {
    console.error('Error fetching education:', error)
    return NextResponse.json(
      { error: 'Failed to fetch education' },
      { status: 500 }
    )
  }
}
