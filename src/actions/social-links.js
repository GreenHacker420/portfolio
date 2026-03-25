
"use server";

import { revalidatePath } from "next/cache";
import { withErrorHandler } from "@/lib/response";
import { requireAdmin } from "@/lib/guard";
import { 
    getAllSocialLinks, 
    createSocialLinkRecord, 
    updateSocialLinkRecord, 
    deleteSocialLinkRecord, 
    refreshPortfolioData 
} from "@/repositories/portfolio.repository";

export async function getSocialLinks() {
    return withErrorHandler(async () => {
        return await getAllSocialLinks();
    });
}

export async function createSocialLink(data) {
    return withErrorHandler(async () => {
        await requireAdmin();
        const link = await createSocialLinkRecord(data);
        await refreshPortfolioData();
        revalidatePath("/admin/social-links");
        revalidatePath("/");
        return link;
    });
}

export async function updateSocialLink(id, data) {
    return withErrorHandler(async () => {
        await requireAdmin();
        const link = await updateSocialLinkRecord(id, data);
        await refreshPortfolioData();
        revalidatePath("/admin/social-links");
        revalidatePath("/");
        revalidatePath(`/admin/social-links/${id}`);
        return link;
    });
}

export async function deleteSocialLink(id) {
    return withErrorHandler(async () => {
        await requireAdmin();
        await deleteSocialLinkRecord(id);
        await refreshPortfolioData();
        revalidatePath("/admin/social-links");
        revalidatePath("/");
        return { success: true };
    });
}
