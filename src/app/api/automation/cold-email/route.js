import { coldEmailGraph } from "@/lib/langgraph/workflows";
import { withApiHandler, apiOk } from "@/lib/apiResponse";

export const POST = withApiHandler(async () => {
    const graph = coldEmailGraph();
    const result = await graph.invoke({});
    return apiOk({ result });
});
