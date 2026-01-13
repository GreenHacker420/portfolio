"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getSocialLinks() {
    try {
        return await prisma.socialLink.findMany({
            orderBy: { platform: 'asc' }
        });
    } catch (error) {
        console.error("Failed to fetch social links:", error);
        return [];
    }
}

export async function createSocialLink(data) {
    try {
        await prisma.socialLink.create({ data });
        revalidatePath("/admin/social-links");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to create social link:", error);
        return { success: false, error: error.message };
    }
}

export async function updateSocialLink(id, data) {
    try {
        await prisma.socialLink.update({
            where: { id },
            data
        });
        revalidatePath("/admin/social-links");
        revalidatePath("/");
        revalidatePath(`/admin/social-links/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update social link:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteSocialLink(id) {
    try {
        await prisma.socialLink.delete({ where: { id } });
        revalidatePath("/admin/social-links");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete social link:", error);
        return { success: false, error: error.message };
    }
}
