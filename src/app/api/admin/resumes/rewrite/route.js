import prisma from "@/lib/db";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { resumeId, jdText } = await req.json();
        if (!resumeId || !jdText) return NextResponse.json({ error: "resumeId and jdText required" }, { status: 400 });

        const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
        if (!resume) return NextResponse.json({ error: "resume not found" }, { status: 404 });

        const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
        const prompt = `
Tailor the following LaTeX resume to the job description. Keep LaTeX valid, concise, and emphasize matching skills. Return ONLY LaTeX.

Job Description:
${jdText}

Current Resume LaTeX:
${resume.latex}
`;
        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });
        const newLatex = typeof result.text === "function" ? result.text() : result.text || resume.latex;

        const updated = await prisma.resume.update({
            where: { id: resumeId },
            data: { latex: newLatex }
        });

        return NextResponse.json({ success: true, latex: updated.latex });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
