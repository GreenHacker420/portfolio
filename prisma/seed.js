
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Start seeding...');

    // Load data
    const projectsPath = path.join(__dirname, '../_legacy_backup/mock/data/projects.json');
    const skillsPath = path.join(__dirname, '../_legacy_backup/mock/data/skills.json');
    const experiencePath = path.join(__dirname, '../_legacy_backup/mock/data/work-experience.json');
    // const personalInfoPath = path.join(__dirname, '../_legacy_backup/mock/data/personal-info.json'); // Might be missing or named differently

    const projects = fs.existsSync(projectsPath) ? JSON.parse(fs.readFileSync(projectsPath, 'utf-8')) : [];
    const skills = fs.existsSync(skillsPath) ? JSON.parse(fs.readFileSync(skillsPath, 'utf-8')) : [];
    const experience = fs.existsSync(experiencePath) ? JSON.parse(fs.readFileSync(experiencePath, 'utf-8')) : [];

    // Clear existing data
    await prisma.project.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.workExperience.deleteMany();

    // Insert Projects
    console.log(`Seeding ${projects.length} Projects...`);
    for (const p of projects) {
        const { id, technologies, ...pData } = p;

        let techStack = [];
        try {
            if (technologies) {
                techStack = typeof technologies === 'string' ? JSON.parse(technologies) : technologies;
            }
        } catch (e) {
            console.warn(`Failed to parse technologies for project ${p.title}:`, technologies);
            techStack = [technologies]; // Fallback
        }

        // Map fields to Schema
        // Schema: title, description, techStack, projectUrl, repoUrl, imageUrl, featured
        // Legacy Data might differ.
        await prisma.project.create({
            data: {
                title: pData.title || "Untitled",
                description: pData.description || "",
                techStack: techStack,
                projectUrl: pData.project_url || pData.projectUrl || "",
                repoUrl: pData.repo_url || pData.repoUrl || "",
                imageUrl: pData.image_url || pData.imageUrl || "",
                featured: pData.featured || false,
                category: pData.category || "Full Stack",
            }
        });
    }

    // Insert Skills
    console.log(`Seeding ${skills.length} Skills...`);
    for (const s of skills) {
        const { id, ...sData } = s;
        try {
            await prisma.skill.create({
                data: {
                    name: sData.name,
                    category: sData.category || "other",
                    level: sData.level || 0,
                    // Handle other fields or defaults
                }
            });
        } catch (e) {
            // Ignore duplicates
        }
    }

    // Insert WorkExperience
    console.log(`Seeding ${experience.length} WorkExperience...`);
    for (const w of experience) {
        const { id, technologies, ...wData } = w;
        // Fix date formats if needed, or assume ISO strings
        await prisma.workExperience.create({
            data: {
                position: wData.position,
                company: wData.company,
                startDate: wData.start_date ? new Date(wData.start_date) : new Date(),
                endDate: wData.end_date ? new Date(wData.end_date) : null,
                // current: wData.current || false, // Not in Schema
                description: wData.description || "",
                location: wData.location || "Remote",
            }
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
