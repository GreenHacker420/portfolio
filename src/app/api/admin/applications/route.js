
import { getAllApplications } from "@/repositories/application.repository";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";

export const GET = withApiHandler(async () => {
    await requireAdmin();
    const applications = await getAllApplications();
    return apiOk(applications);
});
