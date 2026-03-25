
"use server";

import { revalidatePath } from "next/cache";
import { withErrorHandler } from "@/lib/response";
import { requireAdmin } from "@/lib/guard";
import { 
    getAllMedia, 
    createMediaRecord, 
    deleteMediaRecord 
} from "@/repositories/portfolio.repository";

export async function getMedia() {
    return withErrorHandler(async () => {
        await requireAdmin();
        return await getAllMedia();
    });
}

export async function createMedia(data) {
    return withErrorHandler(async () => {
        await requireAdmin();
        const media = await createMediaRecord(data);
        revalidatePath("/admin/media");
        return media;
    });
}

export async function deleteMedia(id) {
    return withErrorHandler(async () => {
        await requireAdmin();
        await deleteMediaRecord(id);
        revalidatePath("/admin/media");
        return { success: true };
    });
}
