"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getMedia() {
    try {
        return await prisma.media.findMany({
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error("Failed to fetch media:", error);
        return [];
    }
}

export async function createMedia(data) {
    try {
        await prisma.media.create({ data });
        revalidatePath("/admin/media");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to create media:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteMedia(id) {
    try {
        await prisma.media.delete({ where: { id } });
        revalidatePath("/admin/media");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete media:", error);
        return { success: false, error: error.message };
    }
}
