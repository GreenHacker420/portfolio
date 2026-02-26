import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { parse, HtmlGenerator } from "latex.js";
import PDFDocument from "pdfkit";

async function tryRemoteLatexCompile(texSource) {
    if (!process.env.LATEX_REMOTE_COMPILE) return null;
    try {
        const res = await fetch("https://latexonline.cc/compile", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ text: texSource })
        });
        if (!res.ok) return null;
        const buf = Buffer.from(await res.arrayBuffer());
        return buf.length > 100 ? buf : null;
    } catch {
        return null;
    }
}

export async function GET(_, { params }) {
    try {
        const { id } = params;
        const resume = await prisma.resume.findUnique({ where: { id } });
        if (!resume) return NextResponse.json({ error: "not found" }, { status: 404 });

        // Try true TeX layout via remote compiler when enabled
        const remotePdf = await tryRemoteLatexCompile(resume.latex);
        if (remotePdf) {
            return new NextResponse(remotePdf, {
                status: 200,
                headers: {
                    "Content-Type": "application/pdf",
                    "Content-Disposition": `attachment; filename=\"resume-${id}.pdf\"`
                }
            });
        }

        // Convert LaTeX to HTML via latex.js
        const generator = new HtmlGenerator({ hyphenate: false });
        const doc = parse(resume.latex, { generator });
        const html = doc.domFragment().textContent || resume.latex;

        // Render text content into PDF for portability
        const pdf = new PDFDocument({ margin: 50 });
        const chunks = [];
        pdf.on("data", c => chunks.push(c));
        pdf.on("end", () => { });

        pdf.fontSize(16).text(resume.title, { underline: true });
        pdf.moveDown();
        pdf.fontSize(11).text(html, { lineGap: 2 });
        pdf.end();
        await new Promise(resolve => pdf.on("end", resolve));
        const buffer = Buffer.concat(chunks);

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename=\"resume-${id}.pdf\"`
            }
        });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
