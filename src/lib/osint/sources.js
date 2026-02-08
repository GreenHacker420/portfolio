// Lightweight placeholder OSINT adapters. Replace with real fetchers (LinkedIn, YC, Wellfound, GitHub, X) later.

export async function fetchYCJobs() {
    return [
        { title: "Full-stack Engineer", company: "YC Startup", url: "https://example.com/yc", location: "Remote", tags: ["fullstack", "react", "node"] }
    ];
}

export async function fetchWellfoundJobs() {
    return [
        { title: "Founding Engineer", company: "Wellfound Co", url: "https://example.com/wf", location: "Remote", tags: ["ai", "nextjs"] }
    ];
}

export async function fetchGithubIssues() {
    return [
        { title: "Contract: build docs site", company: "OSS Maintainer", url: "https://github.com/org/repo/issues/1", location: "Remote", tags: ["docs", "react"] }
    ];
}

export async function normalizeLead(raw, sourceName) {
    return {
        title: raw.title,
        company: raw.company || sourceName,
        url: raw.url,
        location: raw.location,
        remote: /remote/i.test(raw.location || "") || raw.remote || false,
        tags: raw.tags || [],
        sourceName
    };
}
