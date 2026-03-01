import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { ensureStructuredResume } from "@/lib/resume/structured";
import { generateModelText } from "@/lib/ai/router";
import { DEFAULT_MODEL_ID } from "@/lib/ai/models";
import { getMcpContext } from "@/lib/ai/mcp";
import { getPublicResumePdfContext } from "@/lib/resume/pdf-context";

export async function POST(req) {
    try {
        const { resumeId, jdText, sectionKey, messages, modelId, tone, selectionText, useMcp = true, mcpTools = [], enableGeminiWebSearch = false } = await req.json();
        if (!resumeId || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ error: "resumeId and messages are required" }, { status: 400 });
        }

        const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
        if (!resume) {
            return NextResponse.json({ error: "resume not found" }, { status: 404 });
        }
        const pdfContext = await getPublicResumePdfContext();

        const structured = ensureStructuredResume({ latex: resume.latex, structured: resume.structured });
        const section = sectionKey ? structured?.sections?.[sectionKey] : null;
        const historyText = messages
            .slice(-10)
            .map((msg) => `${msg.role === "assistant" ? "Assistant" : "User"}: ${msg.content}`)
            .join("\n");

        let mcpContext = "";
        let mcpUsed = false;
        let mcpToolsUsed = [];
        if (useMcp !== false) {
            const latestUserText = messages[messages.length - 1]?.content || "";
            const mcp = await getMcpContext({
                query: latestUserText,
                scope: "resume_inline_chat",
                mode: "assist",
                toolsRequested: mcpTools,
                payload: {
                    resumeTitle: resume.title,
                    tone: tone || "concise",
                    sectionKey: sectionKey || "",
                    selectionText: selectionText || "",
                    jdText: jdText || ""
                }
            });
            mcpContext = mcp.context || "";
            mcpUsed = mcp.enabled && Boolean(mcpContext);
            mcpToolsUsed = mcp.toolsUsed || [];
        }

        const userPrompt = `
Resume title: ${resume.title}
Tone preference: ${tone || "concise"}
Job description:
${jdText || "Not provided"}

Selected section:
${section?.title || "Not selected"}
${section?.content || ""}

Selected excerpt from editor:
${selectionText || "Not provided"}

Reference context from existing resume.pdf:
${pdfContext?.available ? pdfContext.text : "Not available"}

MCP context:
${mcpContext || "Not available"}

Conversation:
${historyText}

Respond as an inline resume copilot:
- Give direct, specific advice.
- If user asks for rewrite text, return ready-to-paste text.
- Keep it concise and practical.
`;

        const reply = await generateModelText({
            modelId: modelId || DEFAULT_MODEL_ID,
            systemPrompt: "You are an expert resume copilot inside an editor.",
            userPrompt,
            temperature: 0.4,
            maxTokens: 1400,
            enableWebSearch: Boolean(enableGeminiWebSearch)
        });

        return NextResponse.json({
            reply: reply || "I could not generate a response.",
            mcpUsed,
            mcpTools: mcpToolsUsed
        });
    } catch (error) {
        return NextResponse.json({ error: error.message || "Inline chat failed" }, { status: 500 });
    }
}
