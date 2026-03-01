export const GSOC_SECTION_ORDER = [
    { key: "problem_statement", title: "Problem Statement" },
    { key: "proposed_solution", title: "Proposed Solution" },
    { key: "implementation_plan", title: "Implementation Plan" },
    { key: "timeline", title: "Timeline & Milestones" },
    { key: "impact", title: "Expected Impact" },
    { key: "risks", title: "Risks & Mitigations" },
    { key: "about_me", title: "Why I am a Good Fit" },
];

export function createDefaultProposalData({
    title = "GSOC Proposal",
    organization = "",
    projectIdea = ""
} = {}) {
    return {
        meta: {
            title,
            organization,
            projectIdea,
            program: "GSOC",
            lastCritiqueAt: null,
            lastResearchAt: null,
            research: null,
            mentorQuestions: [],
            researchOptions: null
        },
        sections: GSOC_SECTION_ORDER.map((section) => ({
            key: section.key,
            title: section.title,
            content: ""
        })),
        critique: {
            scores: {
                clarity: 0,
                feasibility: 0,
                impact: 0,
                originality: 0,
                completeness: 0
            },
            verdict: "Not evaluated",
            recommendations: []
        }
    };
}

export function ensureProposalData(data, fallback = {}) {
    if (data && typeof data === "object" && Array.isArray(data.sections)) {
        const current = new Map(data.sections.map((section) => [section.key, section]));
        return {
            ...data,
            meta: {
                ...(data.meta || {}),
                title: fallback.title || data.meta?.title || "GSOC Proposal",
                organization: fallback.organization || data.meta?.organization || "",
                projectIdea: fallback.projectIdea || data.meta?.projectIdea || "",
                program: "GSOC",
                lastCritiqueAt: data.meta?.lastCritiqueAt || null,
                lastResearchAt: data.meta?.lastResearchAt || null,
                research: data.meta?.research || null,
                mentorQuestions: Array.isArray(data.meta?.mentorQuestions) ? data.meta.mentorQuestions : [],
                researchOptions: data.meta?.researchOptions || null
            },
            sections: GSOC_SECTION_ORDER.map((defaultSection) => {
                const found = current.get(defaultSection.key);
                return {
                    key: defaultSection.key,
                    title: defaultSection.title,
                    content: found?.content || ""
                };
            }),
            critique: {
                scores: {
                    clarity: Number(data.critique?.scores?.clarity || 0),
                    feasibility: Number(data.critique?.scores?.feasibility || 0),
                    impact: Number(data.critique?.scores?.impact || 0),
                    originality: Number(data.critique?.scores?.originality || 0),
                    completeness: Number(data.critique?.scores?.completeness || 0)
                },
                verdict: data.critique?.verdict || "Not evaluated",
                recommendations: Array.isArray(data.critique?.recommendations) ? data.critique.recommendations : []
            }
        };
    }

    return createDefaultProposalData({
        title: fallback.title || "GSOC Proposal",
        organization: fallback.organization || "",
        projectIdea: fallback.projectIdea || ""
    });
}
