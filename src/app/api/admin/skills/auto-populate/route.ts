import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { inferSkillsFromGitHub } from '@/services/skillInferenceService';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions as any);
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const inferred = await inferSkillsFromGitHub();

    const results: any[] = [];
    for (const s of inferred) {
      const existing = await prisma.skill.findFirst({ where: { name: s.name } });
      if (existing) {
        const updated = await prisma.skill.update({
          where: { id: existing.id },
          data: {
            description: s.description,
            category: s.category,
            level: s.level,
            color: s.color,
            logo: s.logo || null,
            experience: s.experience ?? 0,
            displayOrder: s.displayOrder,
            isVisible: true,
            projects: JSON.stringify(s.projects || []),
            strengths: JSON.stringify(s.strengths || []),
          },
        });
        results.push({ action: 'updated', id: updated.id, name: updated.name });
      } else {
        const created = await prisma.skill.create({
          data: {
            name: s.name,
            description: s.description,
            category: s.category,
            level: s.level,
            color: s.color,
            logo: s.logo || null,
            experience: s.experience ?? 0,
            displayOrder: s.displayOrder,
            isVisible: true,
            projects: JSON.stringify(s.projects || []),
            strengths: JSON.stringify(s.strengths || []),
          },
        });
        results.push({ action: 'created', id: created.id, name: created.name });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error('Auto-populate skills failed:', error);
    return NextResponse.json({ error: error?.message || 'Failed to generate skills' }, { status: 500 });
  }
}

