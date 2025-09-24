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

    const certifications = await prisma.certification.findMany({
      where,
      orderBy: [
        { displayOrder: 'asc' },
        { issueDate: 'desc' }
      ],
      select: {
        id: true,
        name: true,
        issuer: true,
        issueDate: true,
        expiryDate: true,
        credentialId: true,
        credentialUrl: true,
        description: true,
        displayOrder: true,
      }
    })

    return NextResponse.json({ certifications })
  } catch (error) {
    console.error('Error fetching certifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certifications' },
      { status: 500 }
    )
  }
}

