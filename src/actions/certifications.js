
"use server";

import { revalidatePath } from "next/cache";
import { withErrorHandler } from "@/lib/response";
import { requireAdmin } from "@/lib/guard";
import { 
    getAllCertifications, 
    createCertificationRecord, 
    updateCertificationRecord, 
    deleteCertificationRecord, 
    refreshPortfolioData 
} from "@/repositories/portfolio.repository";

export async function getCertifications() {
    return withErrorHandler(async () => {
        return await getAllCertifications();
    });
}

export async function createCertification(data) {
    return withErrorHandler(async () => {
        await requireAdmin();
        const cert = await createCertificationRecord({
            ...data,
            issueDate: new Date(data.issueDate),
            expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        });
        await refreshPortfolioData();
        revalidatePath("/admin/certifications");
        revalidatePath("/");
        return cert;
    });
}

export async function updateCertification(id, data) {
    return withErrorHandler(async () => {
        await requireAdmin();
        const cert = await updateCertificationRecord(id, {
            ...data,
            issueDate: new Date(data.issueDate),
            expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        });
        await refreshPortfolioData();
        revalidatePath("/admin/certifications");
        revalidatePath("/");
        revalidatePath(`/admin/certifications/${id}`);
        return cert;
    });
}

export async function deleteCertification(id) {
    return withErrorHandler(async () => {
        await requireAdmin();
        await deleteCertificationRecord(id);
        await refreshPortfolioData();
        revalidatePath("/admin/certifications");
        revalidatePath("/");
        return { success: true };
    });
}
