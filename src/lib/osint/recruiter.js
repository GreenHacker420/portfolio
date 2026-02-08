export async function findRecruiterEmails(companyDomain) {
    // Heuristic guesses; replace with real enrichment service later.
    const guesses = [
        `hr@${companyDomain}`,
        `careers@${companyDomain}`,
        `recruiting@${companyDomain}`
    ];
    return guesses;
}

export async function verifyEmail(address) {
    // Stub verifier: accepts if contains @ and a dot.
    const ok = !!address && address.includes("@") && address.includes(".");
    return { address, deliverable: ok, reason: ok ? "syntax_ok" : "invalid_syntax" };
}
