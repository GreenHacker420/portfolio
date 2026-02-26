import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { cosineSimilarity } from "@/lib/utils/cosine";

let _embeddings;
function getEmbeddings() {
    if (!_embeddings) {
        _embeddings = new GoogleGenerativeAIEmbeddings({
            modelName: "text-embedding-004",
            apiKey: process.env.GOOGLE_API_KEY
        });
    }
    return _embeddings;
}

function extractSkills(text) {
    if (!text) return [];
    return Array.from(new Set(
        text.toLowerCase()
            .match(/[a-z0-9\+\#\.]{2,}/g)
            ?.filter(w => w.length > 2)
    ));
}

export async function scoreLeadAgainstCv(lead, cvText) {
    const jdText = [
        lead.title,
        lead.company,
        lead.location,
        lead.description || "",
        Array.isArray(lead.tags) ? lead.tags.join(", ") : lead.tags || ""
    ].join("\n");

    const [jdVec, cvVec] = await Promise.all([
        getEmbeddings().embedQuery(jdText),
        getEmbeddings().embedQuery(cvText)
    ]);

    const score = cosineSimilarity(jdVec, cvVec);
    const jdSkills = new Set(Array.isArray(lead.tags) ? lead.tags.map(t => t.toLowerCase()) : extractSkills(lead.description));
    const cvSkills = new Set(extractSkills(cvText));
    const missingSkills = Array.from(jdSkills).filter(s => !cvSkills.has(s)).slice(0, 15);

    return { score, missingSkills };
}
