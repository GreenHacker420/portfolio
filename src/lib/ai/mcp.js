function trimContext(value = "", maxChars = 4000) {
    const text = String(value || "").trim();
    if (text.length <= maxChars) return text;
    return `${text.slice(0, maxChars)}...`;
}

export async function getMcpContext({
    query = "",
    scope = "general",
    payload = {},
    toolsRequested = [],
    mode = "assist",
} = {}) {
    const endpoint = process.env.MCP_BRIDGE_URL;
    if (!endpoint) {
        return { enabled: false, context: "", toolsUsed: [] };
    }

    try {
        const headers = {
            "Content-Type": "application/json",
        };

        if (process.env.MCP_BRIDGE_TOKEN) {
            headers.Authorization = `Bearer ${process.env.MCP_BRIDGE_TOKEN}`;
        }

        const res = await fetch(endpoint, {
            method: "POST",
            headers,
            body: JSON.stringify({
                query,
                scope,
                payload,
                toolsRequested,
                mode
            })
        });

        if (!res.ok) {
            return { enabled: true, context: "", toolsUsed: [] };
        }

        const json = await res.json();

        let context = "";
        if (typeof json?.context === "string") {
            context = json.context;
        } else if (typeof json?.result === "string") {
            context = json.result;
        } else if (typeof json?.data === "string") {
            context = json.data;
        } else if (json?.data && typeof json.data === "object") {
            context = JSON.stringify(json.data, null, 2);
        }

        const toolsUsed = Array.isArray(json?.toolsUsed)
            ? json.toolsUsed
            : Array.isArray(json?.tools)
                ? json.tools
                : [];
        return {
            enabled: true,
            context: trimContext(context),
            toolsUsed
        };
    } catch {
        return { enabled: true, context: "", toolsUsed: [] };
    }
}
