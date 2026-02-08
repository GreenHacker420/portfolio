import prisma from "@/lib/db";
import PDFDocument from "pdfkit";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
    try {
        const { id } = params;
        const resume = await prisma.resume.findUnique({ where: { id } });
        if (!resume) return NextResponse.json({ error: "not found" }, { status: 404 });

        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];
        doc.on("data", chunk => chunks.push(chunk));
        doc.on("end", () => { /* handled below */ });

        doc.fontSize(18).text(resume.title, { underline: true });
        doc.moveDown();
        doc.fontSize(11).text(resume.latex);
        doc.end();

        await new Promise(resolve => doc.on("end", resolve));
        const pdfBuffer = Buffer.concat(chunks);

        return new NextResponse(pdfBuffer, {
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
