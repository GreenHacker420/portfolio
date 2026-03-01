export function parseJsonFromModelText(text = "") {
    const cleaned = String(text || "")
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    try {
        return JSON.parse(cleaned);
    } catch {
        const start = cleaned.indexOf("{");
        const end = cleaned.lastIndexOf("}");
        if (start >= 0 && end > start) {
            return JSON.parse(cleaned.slice(start, end + 1));
        }
        const arrStart = cleaned.indexOf("[");
        const arrEnd = cleaned.lastIndexOf("]");
        if (arrStart >= 0 && arrEnd > arrStart) {
            return JSON.parse(cleaned.slice(arrStart, arrEnd + 1));
        }
        throw new Error("Failed to parse JSON from model output");
    }
}
