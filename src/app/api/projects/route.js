
import { getAllProjects } from "@/repositories/portfolio.repository";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { getClientIp, requireRateLimit } from "@/lib/guard";

export const GET = withApiHandler(async () => {
    const ip = await getClientIp();
    await requireRateLimit(`projects:${ip}`, 20, 60_000);

    const projects = await getAllProjects();
    return apiOk(projects);
});
