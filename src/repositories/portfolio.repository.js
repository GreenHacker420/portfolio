
import prisma from "@/lib/db";
import { DatabaseError, NotFoundError } from "@/lib/errors";

/**
 * PORTFOLIO DATA (READ-ONLY)
 */
async function _fetchPortfolioData() {
    try {
        const [
            projects,
            experience,
            skills,
            personalInfo,
            socialLinks,
            education,
            certifications,
            faqs
        ] = await Promise.all([
            prisma.project.findMany({
                orderBy: { displayOrder: 'asc' },
                where: { isVisible: true }
            }),
            prisma.workExperience.findMany({
                orderBy: { startDate: 'desc' },
                where: { isVisible: true }
            }),
            prisma.skill.findMany({
                orderBy: { level: 'desc' },
                where: { isVisible: true }
            }),
            prisma.personalInfo.findUnique({
                where: { id: "default" }
            }),
            prisma.socialLink.findMany({
                orderBy: { displayOrder: 'asc' },
                where: { isVisible: true }
            }),
            prisma.education.findMany({
                orderBy: { startDate: 'desc' },
                where: { isVisible: true }
            }),
            prisma.certification.findMany({
                orderBy: { issueDate: 'desc' },
                where: { isVisible: true }
            }),
            prisma.fAQ.findMany({
                orderBy: { displayOrder: 'asc' },
                where: { isVisible: true }
            })
        ]);

        return { 
            projects, 
            experience, 
            skills, 
            personalInfo, 
            socialLinks, 
            education, 
            certifications, 
            faqs 
        };
    } catch (error) {
        throw new DatabaseError(error);
    }
}

import { unstable_cache } from "next/cache";
import { CACHE_KEYS, CACHE_TTL } from "@/config/constants";
import { revalidateTag } from "next/cache";

export const getPortfolioData = unstable_cache(
    _fetchPortfolioData,
    [CACHE_KEYS.PORTFOLIO],
    { revalidate: CACHE_TTL.PORTFOLIO, tags: ["portfolio"] }
);

export async function refreshPortfolioData() {
    revalidateTag("portfolio");
}

/**
 * PROJECTS
 */
export async function getAllProjects() {
    return prisma.project.findMany({ orderBy: { displayOrder: 'asc' } });
}

export async function getProjectById(id) {
    return prisma.project.findUnique({ where: { id } });
}

export async function createProjectRecord(data) {
    return prisma.project.create({ data });
}

export async function updateProjectRecord(id, data) {
    return prisma.project.update({ where: { id }, data });
}

export async function deleteProjectRecord(id) {
    return prisma.project.delete({ where: { id } });
}

/**
 * SKILLS
 */
export async function getAllSkills() {
    return prisma.skill.findMany({ orderBy: { level: 'desc' } });
}

export async function getSkillById(id) {
    return prisma.skill.findUnique({ where: { id } });
}

export async function createSkillRecord(data) {
    return prisma.skill.create({ data });
}

export async function updateSkillRecord(id, data) {
    return prisma.skill.update({ where: { id }, data });
}

export async function deleteSkillRecord(id) {
    return prisma.skill.delete({ where: { id } });
}

/**
 * EXPERIENCE
 */
export async function getAllExperience() {
    return prisma.workExperience.findMany({ orderBy: { startDate: 'desc' } });
}

export async function getExperienceById(id) {
    return prisma.workExperience.findUnique({ where: { id } });
}

export async function createExperienceRecord(data) {
    return prisma.workExperience.create({ data });
}

export async function updateExperienceRecord(id, data) {
    return prisma.workExperience.update({ where: { id }, data });
}

export async function deleteExperienceRecord(id) {
    return prisma.workExperience.delete({ where: { id } });
}

/**
 * EDUCATION
 */
export async function getAllEducation() {
    return prisma.education.findMany({ orderBy: { startDate: 'desc' } });
}

export async function getEducationById(id) {
    return prisma.education.findUnique({ where: { id } });
}

export async function createEducationRecord(data) {
    return prisma.education.create({ data });
}

export async function updateEducationRecord(id, data) {
    return prisma.education.update({ where: { id }, data });
}

export async function deleteEducationRecord(id) {
    return prisma.education.delete({ where: { id } });
}

/**
 * CERTIFICATIONS
 */
export async function getAllCertifications() {
    return prisma.certification.findMany({ orderBy: { issueDate: 'desc' } });
}

export async function getCertificationById(id) {
    return prisma.certification.findUnique({ where: { id } });
}

export async function createCertificationRecord(data) {
    return prisma.certification.create({ data });
}

export async function updateCertificationRecord(id, data) {
    return prisma.certification.update({ where: { id }, data });
}

export async function deleteCertificationRecord(id) {
    return prisma.certification.delete({ where: { id } });
}

/**
 * FAQs
 */
export async function getAllFAQs() {
    return prisma.fAQ.findMany({ orderBy: { displayOrder: 'asc' } });
}

export async function getFAQById(id) {
    return prisma.fAQ.findUnique({ where: { id } });
}

export async function createFAQRecord(data) {
    return prisma.fAQ.create({ data });
}

export async function updateFAQRecord(id, data) {
    return prisma.fAQ.update({ where: { id }, data });
}

export async function deleteFAQRecord(id) {
    return prisma.fAQ.delete({ where: { id } });
}

/**
 * SOCIAL LINKS
 */
export async function getAllSocialLinks() {
    return prisma.socialLink.findMany({ orderBy: { platform: 'asc' } });
}

export async function getSocialLinkById(id) {
    return prisma.socialLink.findUnique({ where: { id } });
}

export async function createSocialLinkRecord(data) {
    return prisma.socialLink.create({ data });
}

export async function updateSocialLinkRecord(id, data) {
    return prisma.socialLink.update({ where: { id }, data });
}

export async function deleteSocialLinkRecord(id) {
    return prisma.socialLink.delete({ where: { id } });
}

/**
 * PERSONAL INFO
 */
export async function getPersonalInfoRecord() {
    return prisma.personalInfo.findUnique({ where: { id: "default" } });
}

export async function updatePersonalInfoRecord(data) {
    return prisma.personalInfo.update({ where: { id: "default" }, data });
}

/**
 * MEDIA
 */
export async function getAllMedia() {
    return prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function createMediaRecord(data) {
    return prisma.media.create({ data });
}

export async function deleteMediaRecord(id) {
    return prisma.media.delete({ where: { id } });
}
