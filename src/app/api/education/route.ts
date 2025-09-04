import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { format } from 'date-fns';

export async function GET(request: Request) {
  try {
    const education = await prisma.education.findMany({
      where: { isVisible: true },
      orderBy: [{ displayOrder: 'asc' }, { startDate: 'desc' }],
    });

    const transformedEducation = education.map((edu) => {
      const startDate = format(new Date(edu.startDate), 'MMM yyyy');
      const endDate = edu.endDate ? format(new Date(edu.endDate), 'MMM yyyy') : 'Present';

      return {
        id: edu.id,
        school: edu.institution,
        degree: edu.degree,
        period: `${startDate} - ${endDate}`,
        description: edu.description,
        skills: edu.skills ? JSON.parse(edu.skills) : [],
      };
    });

    return NextResponse.json(transformedEducation);
  } catch (error) {
    console.error('Education API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch education' },
      { status: 500 }
    );
  }
}
