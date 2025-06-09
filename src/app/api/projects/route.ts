import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';

    // Build where clause for filtering
    const where: any = {
      status: 'published' // Only show published projects
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

    // Parse JSON fields and transform data
    const transformedProjects = projects.map((project: any) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      longDescription: project.longDescription,
      category: project.category,
      technologies: project.technologies ? JSON.parse(project.technologies) : [],
      featured: project.featured,
      status: project.status,
      github_url: project.githubUrl,
      live_url: project.liveUrl,
      image_url: project.imageUrl,
      screenshots: project.screenshots ? JSON.parse(project.screenshots) : [],
      start_date: project.startDate,
      end_date: project.endDate,
      highlights: project.highlights ? JSON.parse(project.highlights) : [],
      created_at: project.createdAt,
      updated_at: project.updatedAt
    }));

    // Get unique categories from database
    const allProjects = await prisma.project.findMany({
      where: { status: 'published' },
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


