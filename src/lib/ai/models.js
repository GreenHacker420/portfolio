export const AI_MODEL_OPTIONS = [
    { id: "google:gemini-2.5-flash", label: "Gemini 2.5 Flash", tier: "fast" },
    { id: "google:gemini-2.5-pro", label: "Gemini 2.5 Pro", tier: "quality" },
    { id: "anthropic:claude-3-5-haiku-latest", label: "Claude 3.5 Haiku", tier: "fast" },
    { id: "anthropic:claude-3-5-sonnet-latest", label: "Claude 3.5 Sonnet", tier: "quality" },
    { id: "openai:gpt-4.1-mini", label: "GPT-4.1 Mini", tier: "balanced" },
    { id: "openrouter:deepseek/deepseek-r1:free", label: "DeepSeek R1 Free", tier: "free" },
    { id: "openrouter:meta-llama/llama-3.3-70b-instruct:free", label: "Llama 3.3 Free", tier: "free" },
    { id: "groq:llama-3.3-70b-versatile", label: "Groq Llama 3.3 70B", tier: "fast" },
];

export const DEFAULT_MODEL_ID = "google:gemini-2.5-flash";

export function parseModelId(modelId = DEFAULT_MODEL_ID) {
    if (!modelId || typeof modelId !== "string") {
        return { provider: "google", model: "gemini-2.5-flash" };
    }

    const [provider, ...rest] = modelId.split(":");
    const model = rest.join(":");
    if (!provider || !model) {
        return { provider: "google", model: "gemini-2.5-flash" };
    }
    return { provider, model };
}
