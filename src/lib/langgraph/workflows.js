import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { matchTool } from "./tools/match-tool";
import { contactTool } from "./tools/contact-tool";
import { githubTool } from "./tools/github-tool";
import { retrieverTool } from "./tools/retriever";
import prisma from "@/lib/db";
import { ingestOsintLeads } from "@/actions/leads";
import { processFollowups } from "@/lib/scheduler/followups";

const GraphState = Annotation.Root({
    data: Annotation({ reducer: (x, y) => ({ ...x, ...y }), default: () => ({}) })
});

function wrapNode(fn) {
    return async (state) => ({ data: await fn(state.data || {}) });
}

export const jobDiscoveryGraph = () => {
    const graph = new StateGraph(GraphState)
        .addNode("source_fetcher", wrapNode(async () => {
            const result = await ingestOsintLeads();
            return { ingested: result.inserted };
        }))
        .addNode("deduplicator", wrapNode(async () => ({ deduped: true })))
        .addNode("relevance_scorer", wrapNode(async () => ({ scored: true })))
        .addNode("jd_parser", wrapNode(async () => ({ parsed: true })))
        .addNode("store", wrapNode(async () => ({ stored: true })))
        .addEdge(START, "source_fetcher")
        .addEdge("source_fetcher", "deduplicator")
        .addEdge("deduplicator", "relevance_scorer")
        .addEdge("relevance_scorer", "jd_parser")
        .addEdge("jd_parser", "store")
        .addEdge("store", END);
    return graph.compile();
};

export const cvOptimizationGraph = () => {
    const graph = new StateGraph(GraphState)
        .addNode("cv_parser", wrapNode(async () => ({ cv_parsed: true })))
        .addNode("jd_parser", wrapNode(async () => ({ jd_parsed: true })))
        .addNode("skill_matcher", wrapNode(async () => ({ matched: true })))
        .addNode("cv_rewriter", wrapNode(async () => ({ rewritten: true })))
        .addNode("quality_gate", wrapNode(async () => ({ quality: "ok" })))
        .addEdge(START, "cv_parser")
        .addEdge("cv_parser", "jd_parser")
        .addEdge("jd_parser", "skill_matcher")
        .addEdge("skill_matcher", "cv_rewriter")
        .addEdge("cv_rewriter", "quality_gate")
        .addEdge("quality_gate", END);
    return graph.compile();
};

export const coldEmailGraph = () => {
    const graph = new StateGraph(GraphState)
        .addNode("recruiter_finder", wrapNode(async () => ({ recruiters: [] })))
        .addNode("email_verifier", wrapNode(async () => ({ verified: true })))
        .addNode("personalization", wrapNode(async () => ({ personalized: true })))
        .addNode("email_generator", wrapNode(async () => ({ generated: true })))
        .addNode("compliance", wrapNode(async () => ({ compliant: true })))
        .addNode("scheduler", wrapNode(async () => ({ scheduled: true })))
        .addEdge(START, "recruiter_finder")
        .addEdge("recruiter_finder", "email_verifier")
        .addEdge("email_verifier", "personalization")
        .addEdge("personalization", "email_generator")
        .addEdge("email_generator", "compliance")
        .addEdge("compliance", "scheduler")
        .addEdge("scheduler", END);
    return graph.compile();
};

export const applicationTrackerGraph = () => {
    const graph = new StateGraph(GraphState)
        .addNode("submitter", wrapNode(async () => ({ submitted: true })))
        .addNode("followup_scheduler", wrapNode(async () => {
            await processFollowups();
            return { followups: "processed" };
        }))
        .addNode("reply_classifier", wrapNode(async () => ({ reply: "pending" })))
        .addNode("crm_updater", wrapNode(async () => ({ crm: "updated" })))
        .addEdge(START, "submitter")
        .addEdge("submitter", "followup_scheduler")
        .addEdge("followup_scheduler", "reply_classifier")
        .addEdge("reply_classifier", "crm_updater")
        .addEdge("crm_updater", END);
    return graph.compile();
};
