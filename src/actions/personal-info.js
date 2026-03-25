
'use server'

import { revalidatePath } from "next/cache";
import { withErrorHandler } from "@/lib/response";
import { requireAdmin } from "@/lib/guard";
import { 
    getPersonalInfoRecord, 
    updatePersonalInfoRecord, 
    refreshPortfolioData 
} from "@/repositories/portfolio.repository";

export async function getPersonalInfo() {
    return withErrorHandler(async () => {
        return await getPersonalInfoRecord();
    });
}

export async function updatePersonalInfo(data) {
    return withErrorHandler(async () => {
        await requireAdmin();
        const info = await updatePersonalInfoRecord(data);
        await refreshPortfolioData();
        revalidatePath('/admin/personal-info');
        revalidatePath('/');
        return info;
    });
}
