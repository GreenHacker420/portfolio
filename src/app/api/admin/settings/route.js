
import { getSettings, upsertSettings } from "@/repositories/settings.repository";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";

export const GET = withApiHandler(async () => {
    await requireAdmin();
    const settings = await getSettings();
    return apiOk(settings);
});

export const POST = withApiHandler(async (req) => {
    await requireAdmin();
    const settings = await req.json();
    if (!Array.isArray(settings)) throw new Error("Invalid payload");
    await upsertSettings(settings);
    return apiOk({ success: true });
});
