import { normalizeLead } from "./sources";

/**
 * Fetch jobs via the JSearch (RapidAPI) service.
 * Requires env: JSEARCH_API_KEY
 */
export async function fetchJSearch(query = "software engineer", page = 1) {
    if (!process.env.JSEARCH_API_KEY) {
        console.warn("[jsearch] missing JSEARCH_API_KEY");
        return [];
    }
    const url = new URL("https://jsearch.p.rapidapi.com/search");
    url.searchParams.set("query", query);
    url.searchParams.set("page", page);
    url.searchParams.set("num_pages", 1);

    const res = await fetch(url.toString(), {
        headers: {
            "X-RapidAPI-Key": process.env.JSEARCH_API_KEY,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
        },
        cache: "no-store"
    });
    if (!res.ok) {
        console.error("[jsearch] failed", res.statusText);
        return [];
    }
    const data = await res.json();
    const results = data?.data || [];
    return results.map(r => normalizeLead({
        title: r.job_title,
        company: r.employer_name,
        url: r.job_apply_link || r.job_google_link,
        location: r.job_city || r.job_country || "Remote",
        remote: r.job_is_remote,
        tags: r.job_required_skills || [],
        description: r.job_description
    }, "jsearch"));
}
