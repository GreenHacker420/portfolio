
// DEPRECATED: Use getPortfolioDataWithFallback directly
import { getPortfolioDataWithFallback } from "@/lib/getPortfolioDataWithFallback";

export default async function AllData() {
    return await getPortfolioDataWithFallback();
}
