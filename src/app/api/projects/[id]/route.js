
import { getProjectById } from "@/repositories/portfolio.repository";
import { withApiHandler, apiOk } from "@/lib/apiResponse";

export const GET = withApiHandler(async (req, { params }) => {
    const { id } = await params;
    const project = await getProjectById(id);
    if (!project) throw new Error("Project not found");
    return apiOk(project);
});
