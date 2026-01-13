"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

// Helper to serialize dates
const serializeDates = (data) => {
    if (Array.isArray(data)) {
        return data.map(item => serializeDates(item));
    } else if (data && typeof data === 'object') {
        const newData = {};
        for (const key in data) {
            if (data[key] instanceof Date) {
                newData[key] = data[key].toISOString();
            } else {
                newData[key] = serializeDates(data[key]);
            }
        }
        return newData;
    }
    return data;
};

export async function getEducation() {
    try {
        const edu = await prisma.education.findMany({
            orderBy: { startDate: 'desc' }
        });
        return serializeDates(edu);
    } catch (error) {
        console.error("Failed to fetch education:", error);
        return [];
    }
}

export async function createEducation(data) {
    try {
        await prisma.education.create({
            data: {
                ...data,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
            }
        });
        revalidatePath("/admin/education");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to create education:", error);
        return { success: false, error: error.message };
    }
}

export async function updateEducation(id, data) {
    try {
        await prisma.education.update({
            where: { id },
            data: {
                ...data,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
            }
        });
        revalidatePath("/admin/education");
        revalidatePath("/");
        revalidatePath(`/admin/education/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update education:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteEducation(id) {
    try {
        await prisma.education.delete({ where: { id } });
        revalidatePath("/admin/education");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete education:", error);
        return { success: false, error: error.message };
    }
}
