import { ingestOsintLeads } from "@/actions/leads";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";

export const POST = withApiHandler(async () => {
    await requireAdmin();
    const result = await ingestOsintLeads();
    return apiOk(result);
});
