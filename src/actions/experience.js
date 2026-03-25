
'use server'

import { revalidatePath } from "next/cache";
import { withErrorHandler } from "@/lib/response";
import { requireAdmin } from "@/lib/guard";
import { 
    getAllExperience, 
    createExperienceRecord, 
    updateExperienceRecord, 
    deleteExperienceRecord, 
    refreshPortfolioData 
} from "@/repositories/portfolio.repository";

export async function getExperience() {
    return withErrorHandler(async () => {
        return await getAllExperience();
    });
}

export async function createExperience(data) {
    return withErrorHandler(async () => {
        await requireAdmin();
        const experience = await createExperienceRecord({
            ...data,
            startDate: new Date(data.startDate),
            endDate: data.endDate ? new Date(data.endDate) : null,
            achievements: data.achievements ? JSON.stringify(data.achievements) : null,
            technologies: data.technologies ? JSON.stringify(data.technologies) : null,
        });
        await refreshPortfolioData();
        revalidatePath('/admin/experience');
        revalidatePath('/');
        return experience;
    });
}

export async function updateExperience(id, data) {
    return withErrorHandler(async () => {
        await requireAdmin();
        const experience = await updateExperienceRecord(id, {
            ...data,
            startDate: data.startDate ? new Date(data.startDate) : undefined,
            endDate: data.endDate ? new Date(data.endDate) : undefined,
            achievements: data.achievements ? JSON.stringify(data.achievements) : undefined,
            technologies: data.technologies ? JSON.stringify(data.technologies) : undefined,
        });
        await refreshPortfolioData();
        revalidatePath('/admin/experience');
        revalidatePath('/');
        return experience;
    });
}

export async function deleteExperience(id) {
    return withErrorHandler(async () => {
        await requireAdmin();
        await deleteExperienceRecord(id);
        await refreshPortfolioData();
        revalidatePath('/admin/experience');
        revalidatePath('/');
        return { success: true };
    });
}
