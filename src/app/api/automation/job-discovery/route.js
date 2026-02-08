import { jobDiscoveryGraph } from "@/lib/langgraph/workflows";
import { NextResponse } from "next/server";

export async function POST() {
    const graph = jobDiscoveryGraph();
    const result = await graph.invoke({});
    return NextResponse.json({ success: true, result });
}
