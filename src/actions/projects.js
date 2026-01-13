'use server'

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getProjects() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { displayOrder: 'asc' }
        });
        return { success: true, data: projects };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function createProject(data) {
    try {
        const project = await prisma.project.create({
            data: {
                ...data,
                // Ensure array fields are handled if passed as strings/JSON
                techStack: Array.isArray(data.techStack) ? data.techStack : [],
                // Ensure JSON fields are strings if needed (Prisma @db.Text needs JSON.stringify if it's not handled automatically)
                // However, schema says @db.Text for gallery, highlights etc. 
                // We should ensure we are storing valid JSON string if the input is an object
                gallery: data.gallery ? JSON.stringify(data.gallery) : null,
                highlights: data.highlights ? JSON.stringify(data.highlights) : null,
                challenges: data.challenges ? JSON.stringify(data.challenges) : null,
                learnings: data.learnings ? JSON.stringify(data.learnings) : null,
            }
        });
        revalidatePath('/admin/projects');
        return { success: true, data: project };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function updateProject(id, data) {
    try {
        const project = await prisma.project.update({
            where: { id },
            data: {
                ...data,
                techStack: Array.isArray(data.techStack) ? data.techStack : undefined,
                gallery: data.gallery ? JSON.stringify(data.gallery) : undefined,
                highlights: data.highlights ? JSON.stringify(data.highlights) : undefined,
                challenges: data.challenges ? JSON.stringify(data.challenges) : undefined,
                learnings: data.learnings ? JSON.stringify(data.learnings) : undefined,
            }
        });
        revalidatePath('/admin/projects');
        return { success: true, data: project };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function deleteProject(id) {
    try {
        await prisma.project.delete({ where: { id } });
        revalidatePath('/admin/projects');
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
