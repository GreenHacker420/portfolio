import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { generateModelText } from "@/lib/ai/router";
import { DEFAULT_MODEL_ID } from "@/lib/ai/models";

function safeJsonParse(text = "") {
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

const LoopState = Annotation.Root({
    latex: Annotation({ reducer: (_, y) => y, default: () => "" }),
    jdText: Annotation({ reducer: (_, y) => y, default: () => "" }),
    resumePdfContext: Annotation({ reducer: (_, y) => y, default: () => "" }),
    tone: Annotation({ reducer: (_, y) => y, default: () => "concise" }),
    feedback: Annotation({ reducer: (_, y) => y, default: () => "" }),
    score: Annotation({ reducer: (_, y) => y, default: () => 0 }),
    iteration: Annotation({ reducer: (_, y) => y, default: () => 0 }),
    targetScore: Annotation({ reducer: (_, y) => y, default: () => 8.8 }),
    maxIterations: Annotation({ reducer: (_, y) => y, default: () => 3 }),
    writerModelId: Annotation({ reducer: (_, y) => y, default: () => DEFAULT_MODEL_ID }),
    reviewerModelId: Annotation({ reducer: (_, y) => y, default: () => DEFAULT_MODEL_ID }),
    humanizerModelId: Annotation({ reducer: (_, y) => y, default: () => DEFAULT_MODEL_ID }),
});

async function writerNode(state) {
    const prompt = `
Rewrite this LaTeX resume for the target job.
Tone: ${state.tone}
Reviewer feedback to address:
${state.feedback || "No feedback yet"}

Job Description:
${state.jdText}

Reference context from existing resume.pdf:
${state.resumePdfContext || "Not available"}

Current Resume LaTeX:
${state.latex}

Return only valid LaTeX.
`;
    const rewritten = await generateModelText({
        modelId: state.writerModelId,
        systemPrompt: "You are a resume rewriting specialist maximizing acceptance quality.",
        userPrompt: prompt,
        temperature: 0.25,
        maxTokens: 3200
    });

    return {
        latex: rewritten || state.latex,
        iteration: state.iteration + 1
    };
}

async function reviewerNode(state) {
    const prompt = `
Evaluate this resume for the given JD and return strict JSON:
{
  "score": 0-10,
  "feedback": "actionable critique focusing on missing impact, weak alignment, and clarity"
}

JD:
${state.jdText}

Resume:
${state.latex}
`;
    const reviewText = await generateModelText({
        modelId: state.reviewerModelId,
        systemPrompt: "You are a strict resume reviewer.",
        userPrompt: prompt,
        temperature: 0.15,
        maxTokens: 1200
    });

    const parsed = safeJsonParse(reviewText);
    const score = Math.max(0, Math.min(10, Number(parsed?.score || 0)));
    const feedback = String(parsed?.feedback || "").trim() || "Increase measurable impact and keyword precision.";
    return { score, feedback };
}

async function humanizerNode(state) {
    const prompt = `
Humanize the resume language while preserving exact facts and achievements.
Keep LaTeX valid.

Resume:
${state.latex}

Return only LaTeX.
`;

    const humanized = await generateModelText({
        modelId: state.humanizerModelId,
        systemPrompt: "You humanize text without reducing technical credibility.",
        userPrompt: prompt,
        temperature: 0.35,
        maxTokens: 2600
    });

    return { latex: humanized || state.latex };
}

function routeAfterReview(state) {
    if (state.score >= state.targetScore || state.iteration >= state.maxIterations) {
        return END;
    }
    return "writer";
}

export function buildResumeOptimizationLoop() {
    return new StateGraph(LoopState)
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
