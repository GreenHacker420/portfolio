import prisma from "@/lib/db";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";
import { ensureProposalData } from "@/lib/proposals/defaults";
import { generateModelText } from "@/lib/ai/router";
import { DEFAULT_MODEL_ID } from "@/lib/ai/models";
import { getMcpContext } from "@/lib/ai/mcp";

export const POST = withApiHandler(async (req) => {
    await requireAdmin();
    const { proposalId, sectionKey, tone, messages, modelId, selectionText, useMcp = true, mcpTools = [], enableGeminiWebSearch = false } = await req.json();
    if (!proposalId || !Array.isArray(messages) || messages.length === 0) {
        throw new Error("proposalId and messages are required");
    }

    const proposal = await prisma.proposal.findUnique({ where: { id: proposalId } });
    if (!proposal) {
        throw new Error("proposal not found");
    }

    const data = ensureProposalData(proposal.data, {
        title: proposal.title,
        organization: proposal.organization || "",
        projectIdea: proposal.projectIdea || ""
    });

    const section = data.sections.find((item) => item.key === sectionKey);
    const transcript = messages
        .slice(-12)
        .map((msg) => `${msg.role === "assistant" ? "Assistant" : "User"}: ${msg.content}`)
        .join("\n");

    let mcpContext = "";
    let mcpUsed = false;
    let mcpToolsUsed = [];
    if (useMcp !== false) {
        const latestUserText = messages[messages.length - 1]?.content || "";
        const mcp = await getMcpContext({
            query: latestUserText,
            scope: "proposal_inline_chat",
            mode: "assist",
            toolsRequested: mcpTools,
            payload: {
                proposalTitle: proposal.title,
                tone: tone || proposal.tone || "academic",
                sectionKey: sectionKey || "",
                selectionText: selectionText || "",
                organization: proposal.organization || "",
                projectIdea: proposal.projectIdea || ""
            }
        });
        mcpContext = mcp.context || "";
        mcpUsed = mcp.enabled && Boolean(mcpContext);
        mcpToolsUsed = mcp.toolsUsed || [];
    }

    const prompt = `
You are an inline GSOC proposal copilot.
Proposal title: ${proposal.title}
Organization: ${proposal.organization || "Not specified"}
Project idea: ${proposal.projectIdea || "Not specified"}
Tone: ${tone || proposal.tone || "academic"}

Selected section:
${section?.title || "None"}
${section?.content || ""}

Selected excerpt:
${selectionText || "Not provided"}

MCP context:
${mcpContext || "Not available"}

Conversation:
${transcript}

Respond with concise, practical advice.
If user asks for draft text, return ready-to-paste section text.
`;

    const reply = await generateModelText({
        modelId: modelId || DEFAULT_MODEL_ID,
        systemPrompt: "You are a top-tier GSOC proposal writing copilot.",
        userPrompt: prompt,
        temperature: 0.4,
        maxTokens: 1400,
        enableWebSearch: Boolean(enableGeminiWebSearch)
    });

    return apiOk({
        reply: reply || "No response generated.",
        mcpUsed,
        mcpTools: mcpToolsUsed
    });
});
