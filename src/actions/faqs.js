"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getFAQs() {
    try {
        return await prisma.fAQ.findMany({
            orderBy: { displayOrder: 'asc' }
        });
    } catch (error) {
        console.error("Failed to fetch FAQs:", error);
        return [];
    }
}

export async function createFAQ(data) {
    try {
        await prisma.fAQ.create({ data });
        revalidatePath("/admin/faqs");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to create FAQ:", error);
        return { success: false, error: error.message };
    }
}

export async function updateFAQ(id, data) {
    try {
        await prisma.fAQ.update({
            where: { id },
            data
        });
        revalidatePath("/admin/faqs");
        revalidatePath("/");
        revalidatePath(`/admin/faqs/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update FAQ:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteFAQ(id) {
    try {
        await prisma.fAQ.delete({ where: { id } });
        revalidatePath("/admin/faqs");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete FAQ:", error);
        return { success: false, error: error.message };
    }
}
