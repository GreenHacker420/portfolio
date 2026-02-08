import { normalizeLead } from "./sources";

/**
 * Fetch YC Work at a Startup jobs (public JSON feed).
 */
export async function fetchYC(query = "") {
    const url = "https://www.workatastartup.com/api/v1/jobs";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
        console.error("[yc] failed", res.statusText);
        return [];
    }
    const data = await res.json();
    const jobs = data?.jobs || data || [];
    return jobs
        .filter(j => j.title && j.company_name)
        .filter(j => !query || (j.title + j.company_name).toLowerCase().includes(query.toLowerCase()))
        .map(j => normalizeLead({
            title: j.title,
            company: j.company_name,
            url: `https://www.workatastartup.com/jobs/${j.slug || j.id}`,
            location: j.location || "Remote",
            tags: j.tags || [],
            description: j.description
        }, "yc"));
}
