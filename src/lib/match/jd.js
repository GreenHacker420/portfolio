import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { cosineSimilarity } from "@/lib/utils/cosine";

const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: "text-embedding-004",
    apiKey: process.env.GOOGLE_API_KEY
});

export async function scoreLeadAgainstCv(lead, cvText) {
    const jdText = [
        lead.title,
        lead.company,
        lead.location,
        lead.description || "",
        Array.isArray(lead.tags) ? lead.tags.join(", ") : lead.tags || ""
    ].join("\n");

    const [jdVec, cvVec] = await Promise.all([
        embeddings.embedQuery(jdText),
        embeddings.embedQuery(cvText)
    ]);

    const score = cosineSimilarity(jdVec, cvVec);
    return score;
}
