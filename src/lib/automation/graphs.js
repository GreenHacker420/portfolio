// Skeleton definitions for multi-agent LangGraph flows.
// These are placeholders to be wired with LangGraph once tools are ready.

export const jobDiscoveryGraphSpec = {
    name: "job_discovery",
    nodes: ["source_fetcher", "deduplicator", "relevance_scorer", "jd_parser", "store"],
    edges: [
        ["source_fetcher", "deduplicator"],
        ["deduplicator", "relevance_scorer"],
        ["relevance_scorer", "jd_parser"],
        ["jd_parser", "store"]
    ]
};

export const cvOptimizationGraphSpec = {
    name: "cv_optimization",
    nodes: ["cv_parser", "jd_parser", "skill_matcher", "cv_rewriter", "quality_gate"],
    edges: [
        ["cv_parser", "jd_parser"],
        ["jd_parser", "skill_matcher"],
        ["skill_matcher", "cv_rewriter"],
        ["cv_rewriter", "quality_gate"]
    ]
};

export const coldEmailGraphSpec = {
    name: "cold_email",
    nodes: ["recruiter_finder", "email_verifier", "personalization", "email_generator", "compliance", "scheduler"],
    edges: [
        ["recruiter_finder", "email_verifier"],
        ["email_verifier", "personalization"],
        ["personalization", "email_generator"],
        ["email_generator", "compliance"],
        ["compliance", "scheduler"]
    ]
};

export const applicationTrackerGraphSpec = {
    name: "application_tracker",
    nodes: ["submitter", "followup_scheduler", "reply_classifier", "crm_updater"],
    edges: [
        ["submitter", "followup_scheduler"],
        ["followup_scheduler", "reply_classifier"],
        ["reply_classifier", "crm_updater"]
    ]
};
