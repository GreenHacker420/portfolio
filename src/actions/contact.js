"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getContacts() {
    try {
        return await prisma.contact.findMany({
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error("Failed to fetch messages:", error);
        return [];
    }
}

export async function getContact(id) {
    try {
        return await prisma.contact.findUnique({
            where: { id }
        });
    } catch (error) {
        console.error("Failed to fetch message:", error);
        return null;
    }
}

export async function deleteContact(id) {
    try {
        await prisma.contact.delete({ where: { id } });
        revalidatePath("/admin/contacts");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete message:", error);
        return { success: false, error: error.message };
    }
}

export async function createContact(data) {
    // Public facing action
    try {
        await prisma.contact.create({ data });
        return { success: true };
    } catch (error) {
        console.error("Failed to create message:", error);
        return { success: false, error: error.message };
    }
}
