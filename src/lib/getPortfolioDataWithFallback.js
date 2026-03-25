
import { getPortfolioData } from "@/repositories/portfolio.repository";
import { getMockData } from "./mockData";

export async function getPortfolioDataWithFallback() {
    try {
        const data = await getPortfolioData();
        
        if (!data || !data.personalInfo) {
            console.log("[Data Fetch] No DB data found, falling back to mock data");
            return getMockData();
        }

        console.log("[Data Fetch] Successfully retrieved data from DB/Cache");
        return data;
    } catch (error) {
        console.error("[Data Fetch] Error retrieving portfolio data, falling back to mock data:", error);
        return getMockData();
    }
}
