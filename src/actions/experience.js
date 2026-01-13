'use server'

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getExperience() {
    try {
        const experience = await prisma.workExperience.findMany({
            orderBy: { startDate: 'desc' }
        });
        return { success: true, data: experience };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function createExperience(data) {
    try {
        const experience = await prisma.workExperience.create({
            data: {
                ...data,
                // Ensure array fields are strings or handled
                achievements: data.achievements ? JSON.stringify(data.achievements) : null,
                technologies: data.technologies ? JSON.stringify(data.technologies) : null,
            }
        });
        revalidatePath('/admin/experience');
        return { success: true, data: experience };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function updateExperience(id, data) {
    try {
        const experience = await prisma.workExperience.update({
            where: { id },
            data: {
                ...data,
                achievements: data.achievements ? JSON.stringify(data.achievements) : undefined,
                technologies: data.technologies ? JSON.stringify(data.technologies) : undefined,
            }
        });
        revalidatePath('/admin/experience');
        return { success: true, data: experience };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function deleteExperience(id) {
    try {
        await prisma.workExperience.delete({ where: { id } });
        revalidatePath('/admin/experience');
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
