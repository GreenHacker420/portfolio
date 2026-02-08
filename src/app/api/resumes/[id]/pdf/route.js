import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import latexjs from "latex.js";
import PDFDocument from "pdfkit";

export async function GET(_, { params }) {
    try {
        const { id } = params;
        const resume = await prisma.resume.findUnique({ where: { id } });
        if (!resume) return NextResponse.json({ error: "not found" }, { status: 404 });

        // Convert LaTeX to HTML via latex.js
        const generator = new latexjs.HtmlGenerator({ hyphenate: false });
        const doc = latexjs.parse(resume.latex, { generator });
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
