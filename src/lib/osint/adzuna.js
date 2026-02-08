import { normalizeLead } from "./sources";

/**
 * Fetch jobs from Adzuna API.
 * Requires env: ADZUNA_APP_ID, ADZUNA_API_KEY
 */
export async function fetchAdzuna(query = "software engineer", page = 1, country = "us") {
    const { ADZUNA_APP_ID, ADZUNA_API_KEY } = process.env;
    if (!ADZUNA_APP_ID || !ADZUNA_API_KEY) {
        console.warn("[adzuna] missing credentials");
        return [];
    }
    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_API_KEY}&what=${encodeURIComponent(query)}&content-type=application/json`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
        console.error("[adzuna] failed", res.status, res.statusText);
        return [];
    }
    const data = await res.json();
    const results = data?.results || [];
    return results.map(r => normalizeLead({
        title: r.title,
        company: r.company?.display_name,
        url: r.redirect_url,
        location: r.location?.display_name,
        tags: r.category ? [r.category.label] : [],
        description: r.description,
        remote: /remote/i.test(r.location?.display_name || "")
    }, "adzuna"));
}
