import fs from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse";

const globalCache = globalThis;

function normalizePdfText(text = "") {
    return String(text || "")
        .replace(/\r/g, "")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

export async function getPublicResumePdfContext(maxChars = 6000) {
    const cacheKey = "__publicResumePdfContextCache";
    if (globalCache[cacheKey]) return globalCache[cacheKey];

    const filePath = path.join(process.cwd(), "public", "resume.pdf");

    try {
        const fileBuffer = await fs.readFile(filePath);
        const parsed = await pdfParse(fileBuffer);
        const normalized = normalizePdfText(parsed?.text || "");
        const context = normalized.slice(0, Math.max(1000, Number(maxChars || 6000)));

        const result = {
            available: Boolean(context),
            filePath: "/public/resume.pdf",
            text: context
        };
        globalCache[cacheKey] = result;
        return result;
    } catch {
        const result = {
            available: false,
            filePath: "/public/resume.pdf",
            text: ""
        };
        globalCache[cacheKey] = result;
        return result;
    }
}
