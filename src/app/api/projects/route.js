
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, description, techStack, projectUrl, repoUrl, imageUrl, featured } = body;

        const project = await prisma.project.create({
            data: {
                title,
                description,
                techStack: techStack || [], // Ensure array
                projectUrl,
                repoUrl,
                imageUrl,
                featured: featured || false,
            },
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}
