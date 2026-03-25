
'use server'

import { revalidatePath } from "next/cache";
import { withErrorHandler } from "@/lib/response";
import { requireAdmin } from "@/lib/guard";
import { 
    getAllSkills, 
    createSkillRecord, 
    updateSkillRecord, 
    deleteSkillRecord, 
    refreshPortfolioData 
} from "@/repositories/portfolio.repository";

export async function getSkills() {
    return withErrorHandler(async () => {
        return await getAllSkills();
    });
}

export async function createSkill(data) {
    return withErrorHandler(async () => {
        await requireAdmin();
        const skill = await createSkillRecord({
            ...data,
            level: Number(data.level)
        });
        await refreshPortfolioData();
        revalidatePath('/admin/skills');
        revalidatePath('/');
        return skill;
    });
}

export async function updateSkill(id, data) {
    return withErrorHandler(async () => {
        await requireAdmin();
        const skill = await updateSkillRecord(id, {
            ...data,
            level: Number(data.level)
        });
        await refreshPortfolioData();
        revalidatePath('/admin/skills');
        revalidatePath('/');
        return skill;
    });
}

export async function deleteSkill(id) {
    return withErrorHandler(async () => {
        await requireAdmin();
        await deleteSkillRecord(id);
        await refreshPortfolioData();
        revalidatePath('/admin/skills');
        revalidatePath('/');
        return { success: true };
    });
}
