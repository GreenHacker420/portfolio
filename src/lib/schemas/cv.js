import { z } from "zod";

export const jdSchema = z.object({
    title: z.string(),
    company: z.string().optional(),
    location: z.string().optional(),
    seniority: z.string().optional(),
    responsibilities: z.array(z.string()).optional(),
    requirements: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
});

export const cvSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    location: z.string().optional(),
    summary: z.string().optional(),
    skills: z.array(z.string()),
    experiences: z.array(z.object({
        company: z.string(),
        role: z.string(),
        start: z.string(),
        end: z.string().optional(),
        bullets: z.array(z.string()).optional(),
        tech: z.array(z.string()).optional()
    })),
    projects: z.array(z.object({
        name: z.string(),
        description: z.string().optional(),
        tech: z.array(z.string()).optional(),
        link: z.string().url().optional()
    })).optional(),
    education: z.array(z.object({
        school: z.string(),
        degree: z.string().optional(),
        start: z.string().optional(),
        end: z.string().optional()
    })).optional(),
});
