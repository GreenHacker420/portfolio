
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getMockData } from "@/lib/mockData";

export async function POST() {
    try {
        const data = getMockData();
        const snippets = [];

        // 1. Process Personal Info
        if (data.personalInfo) {
            const info = data.personalInfo;
            snippets.push({
                content: `Bio: ${info.fullName} is a ${info.title}. ${info.bio}. Location: ${info.location}.`,
                source: "Resume",
                tags: JSON.stringify(["bio", "personal"]),
                isVisible: true
            });
        }

        // 2. Process Skills
        if (Array.isArray(data.skills)) {
            data.skills.forEach(skill => {
                snippets.push({
                    content: `Skill: ${skill.name} (${skill.category}). Level: ${skill.level}/100. ${skill.description}`,
                    source: "Skills",
                    tags: JSON.stringify(["skill", skill.category, skill.name.toLowerCase()]),
                    isVisible: true
                });
            });
        }

        // 3. Process Projects
        if (Array.isArray(data.projects)) {
            data.projects.forEach(project => {
                const tags = ["project", project.category, ...(project.techStack || [])];
                snippets.push({
                    content: `Project: ${project.title}. ${project.description} ${project.longDescription || ""}. Tech: ${project.techStack?.join(", ")}. Highlights: ${project.highlights}`,
                    source: "Projects",
                    tags: JSON.stringify(tags),
                    isVisible: true
                });
            });
        }

        // 4. Process Experience
        if (Array.isArray(data.experience)) {
            data.experience.forEach(exp => {
                const tags = ["experience", exp.company, exp.position];
                snippets.push({
                    content: `Work Experience: ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || "Present"}). ${exp.description}. Achievements: ${exp.achievements}`,
                    source: "Work History",
                    tags: JSON.stringify(tags),
                    isVisible: true
                });
            });
        }

        // Insert into DB (skip duplicates check for now, just append)
        // Ideally we'd check for existing content hashes but simple is better for this task.
        const created = await prisma.knowledgeSnippet.createMany({
            data: snippets,
            skipDuplicates: true, // Requires unique constraint, which we might not have on content. 
            // If no unique constraint, this just inserts.
        });

        return NextResponse.json({
            success: true,
            message: `Imported ${created.count} snippets from seed data.`,
            count: created.count
        });

    } catch (error) {
        console.error("Import Error:", error);
        return NextResponse.json({ error: error.message || "Failed to import" }, { status: 500 });
    }
}
