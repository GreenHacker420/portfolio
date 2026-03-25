
"use server";

import { revalidatePath } from "next/cache";
import { withErrorHandler } from "@/lib/response";
import { requireAdmin } from "@/lib/guard";
import { 
    getAllEducation, 
    createEducationRecord, 
    updateEducationRecord, 
    deleteEducationRecord, 
    refreshPortfolioData 
} from "@/repositories/portfolio.repository";

export async function getEducation() {
    return withErrorHandler(async () => {
        return await getAllEducation();
    });
}

export async function createEducation(data) {
    return withErrorHandler(async () => {
        await requireAdmin();
        const edu = await createEducationRecord({
            ...data,
            startDate: new Date(data.startDate),
            endDate: data.endDate ? new Date(data.endDate) : null,
        });
        await refreshPortfolioData();
        revalidatePath("/admin/education");
        revalidatePath("/");
        return edu;
    });
}

export async function updateEducation(id, data) {
    return withErrorHandler(async () => {
        await requireAdmin();
        const edu = await updateEducationRecord(id, {
            ...data,
            startDate: new Date(data.startDate),
            endDate: data.endDate ? new Date(data.endDate) : null,
        });
        await refreshPortfolioData();
        revalidatePath("/admin/education");
        revalidatePath("/");
        revalidatePath(`/admin/education/${id}`);
        return edu;
    });
}

export async function deleteEducation(id) {
    return withErrorHandler(async () => {
        await requireAdmin();
        await deleteEducationRecord(id);
        await refreshPortfolioData();
        revalidatePath("/admin/education");
        revalidatePath("/");
        return { success: true };
    });
}
