'use server'

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getPersonalInfo() {
    try {
        let info = await prisma.personalInfo.findUnique({
            where: { id: "default" }
        });

        return { success: true, data: info };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function updatePersonalInfo(data) {
    try {
        const info = await prisma.personalInfo.update({
            where: { id: "default" },
            data
        });
        revalidatePath('/admin/personal-info');
        revalidatePath('/'); // Revalidate home as it likely uses this info
        return { success: true, data: info };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
