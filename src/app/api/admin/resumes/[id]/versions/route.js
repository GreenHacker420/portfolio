import prisma from "@/lib/db";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";

export const GET = withApiHandler(async (req, { params }) => {
    await requireAdmin();
    if (!prisma?.resumeVersion || typeof prisma.resumeVersion !== "object") {
        return apiOk([]);
    }

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") || 20);

    const versions = await prisma.resumeVersion.findMany({
        where: { resumeId: id },
        orderBy: { createdAt: "desc" },
        take: Number.isNaN(limit) ? 20 : Math.min(Math.max(limit, 1), 100),
        select: {
            id: true,
            title: true,
            source: true,
            createdAt: true,
        }
    });

    return apiOk(versions);
});
