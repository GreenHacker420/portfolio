import prisma from "@/lib/db";
import { GoogleGenAI } from "@google/genai";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";

export const POST = withApiHandler(async (request) => {
    await requireAdmin();
    const { text } = await request.json();

    if (!text || text.length < 50) {
        throw new Error("Insufficient text provided or text too short.");
    }

    // 2. Process with Gemini (New SDK)
    const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

    const prompt = `
    You are an expert Resume Parser. Your job is to extract structured knowledge from the following resume text.
    
    Resume Text:
    """
    ${text}
    """

    Extract the following categories and format them as a JSON array of objects. 
    Each object should have:
    - content: A descriptive string suitable for a RAG knowledge base.
    - source: "Resume"
    - tags: An array of strings describing the item (e.g. ["skill", "react"], ["experience", "Company Name"]).

    Create snippets for:
    1. "Bio": A summary of who the person is.
    2. "Skills": Grouped or individual skills.
    3. "Experience": Each work experience entry.
    4. "Projects": Significant projects mentioned.
    5. "Education": Degrees and schools.

    Output strictly JSON. Example:
    [
        { "content": "Bio: John Doe is a Senior Engineer...", "source": "Resume", "tags": ["bio", "personal"] },
        { "content": "Skill: Experienced in Node.js, React...", "source": "Resume", "tags": ["skill", "full-stack"] }
    ]
    `;

    // New SDK Method
    const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                role: "user",
                parts: [{ text: prompt }]
            }
        ]
    });


    const responseText = (typeof result.text === "function")
        ? result.text()
        : (result.text || JSON.stringify(result));

    // Clean markdown code blocks if present
    const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

    let snippets;
    try {
        snippets = JSON.parse(cleanedText);
    } catch (e) {
        console.error("Failed to parse Gemini response", responseText);
        throw new Error("Failed to parse AI response");
    }

    if (!Array.isArray(snippets)) {
        throw new Error("AI returned invalid structure");
    }

    // 3. Save to DB
    const snippetsToSave = snippets.map(s => ({
        content: s.content,
        source: s.source || "Resume",
        tags: JSON.stringify(s.tags || []),
        isVisible: true
    }));

    const created = await prisma.knowledgeSnippet.createMany({
        data: snippetsToSave
    });

    return apiOk({
        success: true,
        message: `Successfully parsed and added ${created.count} snippets from Resume.`,
        count: created.count
    });
});
