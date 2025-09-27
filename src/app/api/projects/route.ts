import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';

    // Build where clause for filtering
    const where: any = {
      status: 'published', // Only show published projects
      isVisible: true // Only show visible projects
    };

    if (category && category !== 'all') {
      where.category = {
        contains: category,
        mode: 'insensitive'
      };
    }

    if (featured) {
      where.featured = true;
    }

    // Fetch projects from database
    const projects = await prisma.project.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    // Return projects with exact Prisma field names (no transformation needed)
    // The frontend components now handle JSON parsing directly
    const transformedProjects = projects;

    // Get unique categories from database
    const allProjects = await prisma.project.findMany({
      where: { 
        status: 'published',
        isVisible: true 
      },
      select: { category: true }
    });

    const categories = Array.from(new Set(allProjects.map((p: any) => p.category)));

    return NextResponse.json({
      projects: transformedProjects,
      total: transformedProjects.length,
      categories: ['all', ...categories],
    });

  } catch (error) {
    console.error('Projects API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}


