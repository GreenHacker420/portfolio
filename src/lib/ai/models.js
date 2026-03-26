export const AI_MODEL_OPTIONS = [
    { id: "google:gemini-2.5-flash", label: "Gemini 2.5 Flash", tier: "fast", provider: "google" },
    { id: "google:gemini-2.5-pro", label: "Gemini 2.5 Pro", tier: "quality", provider: "google" },
    { id: "anthropic:claude-3-5-haiku-latest", label: "Claude 3.5 Haiku", tier: "fast", provider: "anthropic" },
    { id: "anthropic:claude-3-5-sonnet-latest", label: "Claude 3.5 Sonnet", tier: "quality", provider: "anthropic" },
    { id: "openai:gpt-4.1-mini", label: "GPT-4.1 Mini", tier: "balanced", provider: "openai" },
    { id: "openrouter:deepseek/deepseek-r1:free", label: "DeepSeek R1 Free", tier: "free", provider: "openrouter" },
    { id: "openrouter:meta-llama/llama-3.3-70b-instruct:free", label: "Llama 3.3 Free", tier: "free", provider: "openrouter" },
    { id: "groq:llama-3.3-70b-versatile", label: "Groq Llama 3.3 70B", tier: "fast", provider: "groq" },
];

export const DEFAULT_MODEL_ID = "google:gemini-2.5-flash";

const PROVIDER_KEYS = {
    google: "GOOGLE_API_KEY",
    anthropic: "ANTHROPIC_API_KEY",
    openai: "OPENAI_API_KEY",
    openrouter: "OPENROUTER_API_KEY",
    groq: "GROQ_API_KEY",
};

/**
 * Checks which models have valid API keys configured.
 */
export function getAvailableModels() {
    return AI_MODEL_OPTIONS.filter(model => {
        const keyName = PROVIDER_KEYS[model.provider];
        const hasKey = !!process.env[keyName];
        if (!hasKey) {
            console.warn(`[AI] Model ${model.id} is unavailable: ${keyName} is missing.`);
        }
        return hasKey;
    });
}

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
