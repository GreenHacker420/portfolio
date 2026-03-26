import prisma from "@/lib/db";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";

export const POST = withApiHandler(async (req, { params }) => {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const { followupAt } = body;
    const app = await prisma.application.update({
        where: { id },
        data: { followupAt: followupAt ? new Date(followupAt) : null }
    });
    await prisma.applicationEvent.create({
        data: { applicationId: id, type: "followup_scheduled", payload: { followupAt } }
    });
    return apiOk(app);
});
