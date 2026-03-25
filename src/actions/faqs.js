
"use server";

import { revalidatePath } from "next/cache";
import { withErrorHandler } from "@/lib/response";
import { requireAdmin } from "@/lib/guard";
import { 
    getAllFAQs, 
    createFAQRecord, 
    updateFAQRecord, 
    deleteFAQRecord, 
    refreshPortfolioData 
} from "@/repositories/portfolio.repository";

export async function getFAQs() {
    return withErrorHandler(async () => {
        return await getAllFAQs();
    });
}

export async function createFAQ(data) {
    return withErrorHandler(async () => {
        await requireAdmin();
        const faq = await createFAQRecord(data);
        await refreshPortfolioData();
        revalidatePath("/admin/faqs");
        revalidatePath("/");
        return faq;
    });
}

export async function updateFAQ(id, data) {
    return withErrorHandler(async () => {
        await requireAdmin();
        const faq = await updateFAQRecord(id, data);
        await refreshPortfolioData();
        revalidatePath("/admin/faqs");
        revalidatePath("/");
        revalidatePath(`/admin/faqs/${id}`);
        return faq;
    });
}

export async function deleteFAQ(id) {
    return withErrorHandler(async () => {
        await requireAdmin();
        await deleteFAQRecord(id);
        await refreshPortfolioData();
        revalidatePath("/admin/faqs");
        revalidatePath("/");
        return { success: true };
    });
}
