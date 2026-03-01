import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { generateModelText } from "@/lib/ai/router";
import { DEFAULT_MODEL_ID } from "@/lib/ai/models";

function parseJson(text = "") {
    const cleaned = String(text || "").replace(/```json/gi, "").replace(/```/g, "").trim();
    try {
        return JSON.parse(cleaned);
    } catch {
        const s = cleaned.indexOf("{");
        const e = cleaned.lastIndexOf("}");
        if (s >= 0 && e > s) {
            return JSON.parse(cleaned.slice(s, e + 1));
        }
        return {};
    }
}

const ProposalLoopState = Annotation.Root({
    sections: Annotation({ reducer: (_, y) => y, default: () => [] }),
    organization: Annotation({ reducer: (_, y) => y, default: () => "" }),
    projectIdea: Annotation({ reducer: (_, y) => y, default: () => "" }),
    researchContext: Annotation({ reducer: (_, y) => y, default: () => "" }),
    tone: Annotation({ reducer: (_, y) => y, default: () => "academic" }),
    feedback: Annotation({ reducer: (_, y) => y, default: () => "" }),
    score: Annotation({ reducer: (_, y) => y, default: () => 0 }),
    iteration: Annotation({ reducer: (_, y) => y, default: () => 0 }),
    targetScore: Annotation({ reducer: (_, y) => y, default: () => 8.8 }),
    maxIterations: Annotation({ reducer: (_, y) => y, default: () => 3 }),
    writerModelId: Annotation({ reducer: (_, y) => y, default: () => DEFAULT_MODEL_ID }),
    reviewerModelId: Annotation({ reducer: (_, y) => y, default: () => DEFAULT_MODEL_ID }),
    humanizerModelId: Annotation({ reducer: (_, y) => y, default: () => DEFAULT_MODEL_ID }),
    enableGeminiWebSearch: Annotation({ reducer: (_, y) => y, default: () => false }),
});

function sectionsToText(sections = []) {
    return sections.map((section) => `## ${section.title}\n${section.content || ""}`).join("\n\n");
}

async function writerNode(state) {
    const prompt = `
Improve this GSOC proposal draft based on reviewer feedback.
Organization: ${state.organization}
Project Idea: ${state.projectIdea}
Tone: ${state.tone}
Feedback:
${state.feedback || "No feedback yet"}

Research context:
${state.researchContext || "Not available"}

Current draft:
${sectionsToText(state.sections)}

Return strict JSON:
{ "sections": [ { "key": "...", "title": "...", "content": "..." } ] }
`;

    const text = await generateModelText({
        modelId: state.writerModelId,
        systemPrompt: "You are an elite GSOC proposal drafter.",
        userPrompt: prompt,
        temperature: 0.35,
        maxTokens: 3600,
        enableWebSearch: Boolean(state.enableGeminiWebSearch)
    });
    const parsed = parseJson(text);
    const nextSections = Array.isArray(parsed?.sections) ? parsed.sections : state.sections;
    return { sections: nextSections, iteration: state.iteration + 1 };
}

async function reviewerNode(state) {
    const prompt = `
Review this GSOC proposal draft and return strict JSON:
{
  "score": 0-10,
  "feedback": "concrete weaknesses and fixes"
}

Draft:
${sectionsToText(state.sections)}
`;
    const text = await generateModelText({
        modelId: state.reviewerModelId,
        systemPrompt: "You are a strict GSOC mentor reviewer.",
        userPrompt: prompt,
        temperature: 0.15,
        maxTokens: 1200,
        enableWebSearch: Boolean(state.enableGeminiWebSearch)
    });
    const parsed = parseJson(text);
    return {
        score: Math.max(0, Math.min(10, Number(parsed?.score || 0))),
        feedback: String(parsed?.feedback || "").trim() || "Strengthen feasibility details and measurable impact."
    };
}

async function humanizerNode(state) {
    const prompt = `
Humanize this proposal while preserving technical rigor.
Return strict JSON: { "sections": [ { "key": "...", "title": "...", "content": "..." } ] }

Draft:
${sectionsToText(state.sections)}
`;
    const text = await generateModelText({
        modelId: state.humanizerModelId,
        systemPrompt: "You improve readability and authenticity for technical proposals.",
        userPrompt: prompt,
        temperature: 0.3,
        maxTokens: 3000
    });
    const parsed = parseJson(text);
    return {
        sections: Array.isArray(parsed?.sections) ? parsed.sections : state.sections
    };
}

function routeAfterReview(state) {
    if (state.score >= state.targetScore || state.iteration >= state.maxIterations) {
        return END;
    }
    return "writer";
}

export function buildProposalOptimizationLoop() {
    return new StateGraph(ProposalLoopState)
        .addNode("writer", writerNode)
        .addNode("reviewer", reviewerNode)
        .addNode("humanizer", humanizerNode)
        .addEdge(START, "writer")
        .addEdge("writer", "reviewer")
        .addConditionalEdges("reviewer", routeAfterReview, {
            writer: "writer",
            [END]: "humanizer"
        })
        .addEdge("humanizer", END)
        .compile();
}
