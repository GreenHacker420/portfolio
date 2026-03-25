
export const APP_CONFIG = {
    name: "Harsh Hirawat",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://greenhacker.in",
    githubUsername: "GreenHacker420",
    description: "Creative Developer & AI Engineer building immersive digital experiences."
};

export const AUTH_PATHS = {
    SIGN_IN: "/auth/sign-in",
    UNAUTHORIZED: "/auth/unauthorized"
};

export const CACHE_KEYS = {
    PORTFOLIO: "portfolio_data",
    GITHUB: "github_stats"
};

export const CACHE_TTL = {
    PORTFOLIO: 3600,
    GITHUB: 1800,
    SHORT: 300
};

export const DB_POOL_CONFIG = {
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
};

export const RATE_LIMITS = {
    CONTACT_FORM: { limit: 5, windowMs: 60000 },
    ADMIN_ACTION: { limit: 30, windowMs: 60000 }
};

export const CONTACT_STATUS = {
    NEW: "pending",
    READ: "read",
    RESPONDED: "responded",
    ARCHIVED: "archived"
};

export const CONTACT_PRIORITY = {
    LOW: "low",
    NORMAL: "normal",
    HIGH: "high",
    URGENT: "urgent"
};

export const NAV_ITEMS = [
    { name: "Home", link: "/" },
    { name: "About", link: "#about" },
    { name: "Projects", link: "#projects" },
    { name: "Experience", link: "#experience" },
    { name: "Contact", link: "#contact" }
];
