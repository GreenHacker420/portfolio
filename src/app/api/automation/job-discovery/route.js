import { jobDiscoveryGraph } from "@/lib/langgraph/workflows";
import { withApiHandler } from "@/lib/apiResponse";

export const POST = withApiHandler(async () => {
    const graph = jobDiscoveryGraph();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            try {
                const eventStream = await graph.stream({}, { streamMode: "updates" });
                for await (const update of eventStream) {
                    const chunk = JSON.stringify({ type: "update", data: update }) + "\n";
                    controller.enqueue(encoder.encode(chunk));
                }
                controller.close();
            } catch (error) {
                console.error("[JobDiscovery Stream Error]", error);
                const chunk = JSON.stringify({ type: "error", message: error.message }) + "\n";
                controller.enqueue(encoder.encode(chunk));
                controller.close();
            }
        }
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "application/x-ndjson",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    });
});
