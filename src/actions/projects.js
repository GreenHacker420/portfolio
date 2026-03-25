
'use server'

import { revalidatePath } from "next/cache";
import { withErrorHandler } from "@/lib/response";
import { requireAdmin } from "@/lib/guard";
import { 
    getAllProjects, 
    createProjectRecord, 
    updateProjectRecord, 
    deleteProjectRecord, 
    refreshPortfolioData 
} from "@/repositories/portfolio.repository";

export async function getProjects() {
    return withErrorHandler(async () => {
        return await getAllProjects();
    });
}

export async function createProject(data) {
    return withErrorHandler(async () => {
        await requireAdmin();
        const project = await createProjectRecord({
            ...data,
            techStack: Array.isArray(data.techStack) ? data.techStack : [],
            gallery: data.gallery ? JSON.stringify(data.gallery) : null,
            highlights: data.highlights ? JSON.stringify(data.highlights) : null,
            challenges: data.challenges ? JSON.stringify(data.challenges) : null,
            learnings: data.learnings ? JSON.stringify(data.learnings) : null,
        });
        await refreshPortfolioData();
        revalidatePath('/admin/projects');
        revalidatePath('/');
        return project;
    });
}

export async function updateProject(id, data) {
    return withErrorHandler(async () => {
        await requireAdmin();
        const project = await updateProjectRecord(id, {
            ...data,
            techStack: Array.isArray(data.techStack) ? data.techStack : undefined,
            gallery: data.gallery ? JSON.stringify(data.gallery) : undefined,
            highlights: data.highlights ? JSON.stringify(data.highlights) : undefined,
            challenges: data.challenges ? JSON.stringify(data.challenges) : undefined,
            learnings: data.learnings ? JSON.stringify(data.learnings) : undefined,
        });
        await refreshPortfolioData();
        revalidatePath('/admin/projects');
        revalidatePath('/');
        return project;
    });
}

export async function deleteProject(id) {
    return withErrorHandler(async () => {
        await requireAdmin();
        await deleteProjectRecord(id);
        await refreshPortfolioData();
        revalidatePath('/admin/projects');
        revalidatePath('/');
        return { success: true };
    });
}
