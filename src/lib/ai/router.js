import { GoogleGenAI } from "@google/genai";
import { DEFAULT_MODEL_ID, parseModelId } from "./models";

function buildMessages(systemPrompt, userPrompt) {
    return [
        systemPrompt ? { role: "system", content: systemPrompt } : null,
        { role: "user", content: userPrompt }
    ].filter(Boolean);
}

async function runGemini({
    model,
    systemPrompt,
    userPrompt,
    temperature = 0.2,
    maxTokens = 1800,
    enableWebSearch = false,
    googleSearchOptions = {}
}) {
    if (!process.env.GOOGLE_API_KEY) {
        throw new Error("GOOGLE_API_KEY is missing");
    }
    const client = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    const prompt = systemPrompt
        ? `${systemPrompt}\n\n${userPrompt}`
        : userPrompt;

    const config = {};
    if (typeof temperature === "number") config.temperature = temperature;
    if (typeof maxTokens === "number") config.maxOutputTokens = maxTokens;
    if (enableWebSearch) {
        config.tools = [{ googleSearch: googleSearchOptions || {} }];
    }

    const result = await client.models.generateContent({
        model,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        ...(Object.keys(config).length > 0 ? { config } : {})
    });

    const text = typeof result.text === "function" ? result.text() : result.text;
    return (text || "").trim();
}

async function runAnthropic({ model, systemPrompt, userPrompt, temperature = 0.2, maxTokens = 1800 }) {
    if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error("ANTHROPIC_API_KEY is missing");
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
            model,
            system: systemPrompt || undefined,
            temperature,
            max_tokens: maxTokens,
            messages: [{ role: "user", content: userPrompt }]
        })
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Anthropic API error: ${res.status} ${errText}`);
    }

    const json = await res.json();
    const text = Array.isArray(json?.content)
        ? json.content.map((part) => part?.text || "").join("\n")
        : "";
    return text.trim();
}

async function runOpenAICompatible({
    baseUrl,
    apiKey,
    model,
    systemPrompt,
    userPrompt,
    temperature = 0.2,
    maxTokens = 1800,
    extraHeaders = {}
}) {
    if (!apiKey) {
        throw new Error("Missing API key for OpenAI-compatible provider");
    }

    const endpoint = `${baseUrl.replace(/\/$/, "")}/chat/completions`;
    const res = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            ...extraHeaders
        },
        body: JSON.stringify({
            model,
            temperature,
            max_tokens: maxTokens,
            messages: buildMessages(systemPrompt, userPrompt)
        })
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Provider API error: ${res.status} ${errText}`);
    }

    const json = await res.json();
    return String(json?.choices?.[0]?.message?.content || "").trim();
}

export async function generateModelText({
    modelId = DEFAULT_MODEL_ID,
    systemPrompt = "",
    userPrompt = "",
    temperature = 0.2,
    maxTokens = 1800,
    enableWebSearch = false,
    googleSearchOptions = {}
}) {
    const { provider, model } = parseModelId(modelId);

    try {
        if (provider === "google") {
            return await runGemini({
                model,
                systemPrompt,
                userPrompt,
                temperature,
                maxTokens,
                enableWebSearch,
                googleSearchOptions
            });
        }

        if (provider === "anthropic") {
            return await runAnthropic({ model, systemPrompt, userPrompt, temperature, maxTokens });
        }

        if (provider === "openai") {
            return await runOpenAICompatible({
                baseUrl: "https://api.openai.com/v1",
                apiKey: process.env.OPENAI_API_KEY,
                model,
                systemPrompt,
                userPrompt,
                temperature,
                maxTokens
            });
        }

        if (provider === "openrouter") {
            return await runOpenAICompatible({
                baseUrl: "https://openrouter.ai/api/v1",
                apiKey: process.env.OPENROUTER_API_KEY,
                model,
                systemPrompt,
                userPrompt,
                temperature,
                maxTokens,
                extraHeaders: {
                    "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
                    "X-Title": "Personal Intelligence Workspace"
                }
            });
        }

        if (provider === "groq") {
            return await runOpenAICompatible({
                baseUrl: "https://api.groq.com/openai/v1",
                apiKey: process.env.GROQ_API_KEY,
                model,
                systemPrompt,
                userPrompt,
                temperature,
                maxTokens
            });
        }

        throw new Error(`Unsupported provider: ${provider}`);
    } catch (error) {
        if (modelId !== DEFAULT_MODEL_ID) {
            return generateModelText({
                modelId: DEFAULT_MODEL_ID,
                systemPrompt,
                userPrompt,
                temperature,
                maxTokens,
                enableWebSearch,
                googleSearchOptions
            });
        }
        throw error;
    }
}
