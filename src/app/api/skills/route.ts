import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// In-memory cache for skills data
let skillsCache: {
  data: any[] | null
  timestamp: number
  etag: string
} = {
  data: null,
  timestamp: 0,
  etag: ''
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

function generateETag(data: any): string {
  return Buffer.from(JSON.stringify(data)).toString('base64').slice(0, 16)
}

export async function GET(request: NextRequest) {
  try {
    const now = Date.now()
    const ifNoneMatch = request.headers.get('if-none-match')
    
    // Check if cache is still valid
    const isCacheValid = skillsCache.data && (now - skillsCache.timestamp) < CACHE_DURATION
    
    if (isCacheValid) {
      // Check ETag for client-side cache
      if (ifNoneMatch && ifNoneMatch === skillsCache.etag) {
        return new NextResponse(null, { 
          status: 304,
          headers: {
            'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
            'ETag': skillsCache.etag,
          }
        })
      }
      
      // Return cached data
      return NextResponse.json({ 
        skills: skillsCache.data,
        total: skillsCache.data.length,
        cached: true,
        cacheAge: Math.floor((now - skillsCache.timestamp) / 1000)
      }, {
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
          'ETag': skillsCache.etag,
          'X-Cache': 'HIT'
        }
      })
    }

    // Fetch fresh data from database
    const skills = await prisma.skill.findMany({
      where: {
        isVisible: true
      },
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' }
      ],
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        level: true,
        color: true,
        logo: true,
        experience: true,
        projects: true,
        strengths: true,
        displayOrder: true,
        isVisible: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    // Transform the data to match frontend expectations
    const transformedSkills = skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      description: skill.description || '',
      logo: skill.logo || '',
      color: skill.color,
      experience: skill.experience || 0,
      proficiency: skill.level, // Map level to proficiency for backward compatibility
      level: skill.level,
      projects: skill.projects ? JSON.parse(skill.projects) : [],
      strengths: skill.strengths ? JSON.parse(skill.strengths) : [],
      category: skill.category as 'frontend' | 'backend' | 'language' | 'database' | 'devops' | 'mobile' | 'design' | 'other',
      displayOrder: skill.displayOrder,
      isVisible: skill.isVisible,
      createdAt: skill.createdAt,
      updatedAt: skill.updatedAt,
    }))

    // Update cache
    const etag = generateETag(transformedSkills)
    skillsCache = {
      data: transformedSkills,
      timestamp: now,
      etag
    }

    return NextResponse.json({ 
      skills: transformedSkills,
      total: transformedSkills.length,
      cached: false
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
        'ETag': etag,
        'X-Cache': 'MISS'
      }
    })

  } catch (error) {
    console.error('Skills fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    )
  }
}

// Cache the response for 5 minutes
export const revalidate = 300

// Function to invalidate cache (can be called from admin operations)
export function invalidateSkillsCache() {
  skillsCache.data = null
  skillsCache.timestamp = 0
  skillsCache.etag = ''
}
