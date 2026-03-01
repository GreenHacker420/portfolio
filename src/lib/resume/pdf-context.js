import fs from "fs/promises";
import path from "path";
import * as pdfParseModule from "pdf-parse";

const globalCache = globalThis;

function normalizePdfText(text = "") {
    return String(text || "")
        .replace(/\r/g, "")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

async function extractPdfText(fileBuffer) {
    const legacyParser =
        (typeof pdfParseModule === "function" ? pdfParseModule : null) ||
        (typeof pdfParseModule?.default === "function" ? pdfParseModule.default : null);
    if (legacyParser) {
        const parsed = await legacyParser(fileBuffer);
        return String(parsed?.text || "");
    }

    const PDFParseClass =
        pdfParseModule?.PDFParse ||
        pdfParseModule?.default?.PDFParse ||
        null;
    if (typeof PDFParseClass === "function") {
        const parser = new PDFParseClass({ data: fileBuffer });
        try {
            const parsed = await parser.getText();
            return String(parsed?.text || "");
        } finally {
            if (typeof parser.destroy === "function") {
                await parser.destroy();
            }
        }
    }

    throw new Error("Unsupported pdf-parse API");
}

export async function getPublicResumePdfContext(maxChars = 6000) {
    const cacheKey = "__publicResumePdfContextCache";
    if (globalCache[cacheKey]) return globalCache[cacheKey];

    const filePath = path.join(process.cwd(), "public", "resume.pdf");

    try {
        const fileBuffer = await fs.readFile(filePath);
        const parsedText = await extractPdfText(fileBuffer);
        const normalized = normalizePdfText(parsedText);
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
