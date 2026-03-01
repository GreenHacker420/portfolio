const SECTION_PATTERN = /\\section\*?\{([^}]+)\}([\s\S]*?)(?=\\section\*?\{|$)/gi;

function normalizeSectionTitle(title = "") {
    const t = title.toLowerCase().trim();
    if (t.includes("summary") || t.includes("profile") || t.includes("about")) return "summary";
    if (t.includes("skill")) return "skills";
    if (t.includes("experience") || t.includes("work")) return "experience";
    if (t.includes("project")) return "projects";
    if (t.includes("education")) return "education";
    if (t.includes("achievement")) return "achievements";
    return t.replace(/[^a-z0-9]+/g, "_");
}

function compactLatexBody(body = "") {
    return body
        .replace(/\\begin\{itemize\}|\\end\{itemize\}/g, "")
        .replace(/\\item\s*/g, "- ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

export function deriveStructuredFromLatex(latex = "") {
    const sections = {};
    if (!latex || typeof latex !== "string") {
        return { sections, source: "derived_from_latex" };
    }

    for (const match of latex.matchAll(SECTION_PATTERN)) {
        const rawTitle = (match[1] || "").trim();
        const key = normalizeSectionTitle(rawTitle);
        const content = compactLatexBody(match[2] || "");
        sections[key] = {
            title: rawTitle || key,
            content,
        };
    }

    return { sections, source: "derived_from_latex" };
}

export function ensureStructuredResume({ latex = "", structured = null } = {}) {
    if (structured && typeof structured === "object") {
        return structured;
    }
    return deriveStructuredFromLatex(latex);
}

function escapeRegExp(value = "") {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sectionTextToLatexBody(content = "") {
    const lines = content
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    if (lines.length > 0 && lines.every((line) => line.startsWith("- "))) {
        const items = lines.map((line) => line.replace(/^-+\s*/, ""));
        return [
            "\\begin{itemize}",
            ...items.map((item) => `\\item ${item}`),
            "\\end{itemize}",
            ""
        ].join("\n");
    }

    return `${content.trim()}\n`;
}

export function applySectionContentToLatex(latex = "", sectionTitle = "", sectionContent = "") {
    if (!latex || !sectionTitle) return latex;
    const escapedTitle = escapeRegExp(sectionTitle);
    const pattern = new RegExp(`(\\\\section\\*?\\{${escapedTitle}\\})([\\s\\S]*?)(?=\\\\section\\*?\\{|$)`, "i");
    const body = `\n${sectionTextToLatexBody(sectionContent)}\n`;

    if (pattern.test(latex)) {
        return latex.replace(pattern, `$1${body}`);
    }

    if (latex.includes("\\end{document}")) {
        return latex.replace("\\end{document}", `\\section{${sectionTitle}}\n${sectionTextToLatexBody(sectionContent)}\n\\end{document}`);
    }

    return `${latex}\n\\section{${sectionTitle}}\n${sectionTextToLatexBody(sectionContent)}`;
}
