
// DEPRECATED: Use src/repositories/portfolio.repository.js
import { getPortfolioData } from "@/repositories/portfolio.repository";

export default async function getData() {
  try {
    return await getPortfolioData();
  } catch (error) {
    console.error("Deprecated getData (dbfetch.js) failed:", error);
    return null;
  }
}
