'use server'

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getSkills() {
    try {
        const skills = await prisma.skill.findMany({
            orderBy: { level: 'desc' }
        });
        return { success: true, data: skills };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function createSkill(data) {
    try {
        const skill = await prisma.skill.create({
            data: {
                ...data,
                level: Number(data.level)
            }
        });
        revalidatePath('/admin/skills');
        return { success: true, data: skill };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function updateSkill(id, data) {
    try {
        const skill = await prisma.skill.update({
            where: { id },
            data: {
                ...data,
                level: Number(data.level)
            }
        });
        revalidatePath('/admin/skills');
        return { success: true, data: skill };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function deleteSkill(id) {
    try {
        await prisma.skill.delete({ where: { id } });
        revalidatePath('/admin/skills');
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
