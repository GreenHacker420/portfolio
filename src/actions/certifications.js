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

export async function getCertifications() {
    try {
        const certs = await prisma.certification.findMany({
            orderBy: { issueDate: 'desc' }
        });
        return serializeDates(certs);
    } catch (error) {
        console.error("Failed to fetch certifications:", error);
        return [];
    }
}

export async function createCertification(data) {
    try {
        await prisma.certification.create({
            data: {
                ...data,
                issueDate: new Date(data.issueDate),
                expirationDate: data.expirationDate ? new Date(data.expirationDate) : null,
            }
        });
        revalidatePath("/admin/certifications");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to create certification:", error);
        return { success: false, error: error.message };
    }
}

export async function updateCertification(id, data) {
    try {
        await prisma.certification.update({
            where: { id },
            data: {
                ...data,
                issueDate: new Date(data.issueDate),
                expirationDate: data.expirationDate ? new Date(data.expirationDate) : null,
            }
        });
        revalidatePath("/admin/certifications");
        revalidatePath("/");
        revalidatePath(`/admin/certifications/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update certification:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteCertification(id) {
    try {
        await prisma.certification.delete({ where: { id } });
        revalidatePath("/admin/certifications");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete certification:", error);
        return { success: false, error: error.message };
    }
}
