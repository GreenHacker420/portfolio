import { normalizeLead } from "./sources";

export async function fetchRemoteOk(query = "") {
    const res = await fetch("https://remoteok.com/api", { headers: { "Accept": "application/json" }, cache: "no-store" });
    const data = await res.json();
    // First element is metadata
    return data.slice(1)
        .filter(job => job?.position && job?.company)
        .filter(job => !query || (job.position + job.tags?.join(" ")).toLowerCase().includes(query.toLowerCase()))
        .map(job => normalizeLead({
            title: job.position,
            company: job.company,
            url: job.url,
            location: job.location || "Remote",
            tags: job.tags || []
        }, "remoteok"));
}
