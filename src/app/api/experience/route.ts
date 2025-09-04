// WorkExperience

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { format } from 'date-fns';

export async function GET(request: Request) {
  try {
    const experiences = await prisma.workExperience.findMany({
      where: { isVisible: true },
      orderBy: [{ displayOrder: 'asc' }, { startDate: 'desc' }],
    });

    const transformedExperiences = experiences.map((exp) => {
      const startDate = format(new Date(exp.startDate), 'MMM yyyy');
      const endDate = exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : 'Present';

      return {
        id: exp.id,
        title: exp.title,
        company: exp.company,
        period: `${startDate} - ${endDate}`,
        location: exp.location,
        type: exp.type,
        description: exp.description,
        skills: exp.skills ? JSON.parse(exp.skills) : [],
      };
    });

    return NextResponse.json(transformedExperiences);
  } catch (error) {
    console.error('Work Experience API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch work experience' },
      { status: 500 }
    );
  }
}
  
  