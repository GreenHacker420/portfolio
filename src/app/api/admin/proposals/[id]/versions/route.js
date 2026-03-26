import prisma from "@/lib/db";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";

export const GET = withApiHandler(async (req, { params }) => {
    await requireAdmin();
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") || 20);

    const versions = await prisma.proposalVersion.findMany({
        where: { proposalId: id },
        orderBy: { createdAt: "desc" },
        take: Number.isNaN(limit) ? 20 : Math.min(Math.max(limit, 1), 100),
        select: {
            id: true,
            title: true,
            tone: true,
            source: true,
            createdAt: true
        }
    });

    return apiOk(versions);
});
