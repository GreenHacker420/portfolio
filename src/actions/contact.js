"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getContacts() {
    try {
        return await prisma.contact.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                replies: {
                    select: { id: true, createdAt: true },
                    take: 1,
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
    } catch (error) {
        console.error("Failed to fetch messages:", error);
        return [];
    }
}

export async function getContact(id) {
    try {
        return await prisma.contact.findUnique({
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
    } catch (error) {
        console.error("Failed to fetch message:", error);
        return null;
    }
}

export async function deleteContact(id) {
    try {
        await prisma.contact.delete({ where: { id } });
        revalidatePath("/admin/messages");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete message:", error);
        return { success: false, error: error.message };
    }
}

export async function createContact(data) {
    // Public facing action
    try {
        await prisma.contact.create({ data });
        return { success: true };
    } catch (error) {
        console.error("Failed to create message:", error);
        return { success: false, error: error.message };
    }
}

export async function updateContactStatus(id, status) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    try {
        await prisma.contact.update({
            where: { id },
            data: { status }
        });
        revalidatePath("/admin/messages");
        return { success: true };
    } catch (error) {
        console.error("Failed to update status:", error);
        return { success: false, error: error.message };
    }
}

export async function updateContactPriority(id, priority) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    try {
        await prisma.contact.update({
            where: { id },
            data: { priority }
        });
        revalidatePath("/admin/messages");
        return { success: true };
    } catch (error) {
        console.error("Failed to update priority:", error);
        return { success: false, error: error.message };
    }
}

export async function replyToContact(contactId, replyData) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    try {
        // Find admin user by session email
        const adminUser = await prisma.adminUser.findUnique({
            where: { email: session.user.email }
        });
        if (!adminUser) throw new Error("Admin user not found");

        // Create the reply
        const reply = await prisma.contactReply.create({
            data: {
                contactId,
                userId: adminUser.id,
                subject: replyData.subject,
                message: replyData.message,
                isAiGenerated: replyData.isAiGenerated || false,
                aiMode: replyData.aiMode || null,
            }
        });

        // Update contact status to responded
        await prisma.contact.update({
            where: { id: contactId },
            data: { status: 'responded' }
        });

        // Optionally send the email via Graph API
        if (replyData.sendEmail) {
            try {
                const contact = await prisma.contact.findUnique({ where: { id: contactId } });
                if (contact?.email) {
                    await fetch(`${process.env.NEXTAUTH_URL || ''}/api/mail`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            to: contact.email,
                            subject: replyData.subject,
                            body: replyData.message,
                        })
                    });

                    // Mark reply as email sent
                    await prisma.contactReply.update({
                        where: { id: reply.id },
                        data: { emailSent: true }
                    });
                }
            } catch (emailError) {
                console.error("Failed to send reply email:", emailError);
                // Don't fail the whole operation if email fails
            }
        }

        revalidatePath("/admin/messages");
        revalidatePath(`/admin/messages/${contactId}`);
        return { success: true, replyId: reply.id };
    } catch (error) {
        console.error("Failed to reply:", error);
        return { success: false, error: error.message };
    }
}
