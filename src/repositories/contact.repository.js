
import prisma from "@/lib/db";
import { DatabaseError, NotFoundError } from "@/lib/errors";

export async function createContactRecord(data) {
    try {
        return await prisma.contact.create({
            data: {
                name: data.name,
                email: data.email,
                subject: data.subject || "No Subject",
                message: data.message,
                source: data.source || "website",
                inquiryType: data.inquiryType || "GENERAL",
                projectDetails: data.projectDetails ? JSON.stringify(data.projectDetails) : null,
                budget: data.budget,
                salary: data.salary,
                metadata: data.metadata ? JSON.stringify(data.metadata) : null
            }
        });
    } catch (error) {
        throw new DatabaseError(error);
    }
}

export async function getAllContacts({ page = 1, limit = 50, status } = {}) {
    try {
        const where = status ? { status } : {};
        return await prisma.contact.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                replies: {
                    select: { id: true, createdAt: true },
                    take: 1,
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
    } catch (error) {
        throw new DatabaseError(error);
    }
}

export async function getContactById(id) {
    try {
        const contact = await prisma.contact.findUnique({
            where: { id },
            include: {
                replies: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                }
            }
        });
        
        if (!contact) throw new NotFoundError("Contact");
        return contact;
    } catch (error) {
        if (error instanceof NotFoundError) throw error;
        throw new DatabaseError(error);
    }
}

export async function updateContactStatus(id, status) {
    try {
        return await prisma.contact.update({
            where: { id },
            data: { status }
        });
    } catch (error) {
        throw new DatabaseError(error);
    }
}

export async function updateContactPriority(id, priority) {
    try {
        return await prisma.contact.update({
            where: { id },
            data: { priority }
        });
    } catch (error) {
        throw new DatabaseError(error);
    }
}

export async function deleteContactRecord(id) {
    try {
        return await prisma.contact.delete({ where: { id } });
    } catch (error) {
        throw new DatabaseError(error);
    }
}
