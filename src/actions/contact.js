
"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/guard";
import { withErrorHandler } from "@/lib/response";
import { 
    getAllContacts, 
    getContactById, 
    deleteContactRecord, 
    createContactRecord, 
    updateContactStatus as repoUpdateStatus, 
    updateContactPriority as repoUpdatePriority 
} from "@/repositories/contact.repository";
import { 
    getAdminUserByEmail, 
    createContactReply, 
    updateContactReply 
} from "@/repositories/admin.repository";
import { sendMail } from "@/lib/mail";

export async function getContacts() {
    return withErrorHandler(async () => {
        await requireAdmin();
        return await getAllContacts();
    });
}

export async function getContact(id) {
    return withErrorHandler(async () => {
        await requireAdmin();
        return await getContactById(id);
    });
}

export async function deleteContact(id) {
    return withErrorHandler(async () => {
        await requireAdmin();
        await deleteContactRecord(id);
        revalidatePath("/admin/messages");
        return { success: true };
    });
}

export async function createContact(data) {
    const cleanData = {
        name: data.name?.slice(0, 100),
        email: data.email?.toLowerCase().trim(),
        subject: data.subject?.slice(0, 200),
        message: data.message?.slice(0, 5000),
        inquiryType: data.inquiryType,
        projectDetails: data.projectDetails,
        budget: data.budget,
        salary: data.salary
    };

    return withErrorHandler(async () => {
        return await createContactRecord(cleanData);
    });
}

export async function updateContactStatus(id, status) {
    return withErrorHandler(async () => {
        await requireAdmin();
        await repoUpdateStatus(id, status);
        revalidatePath("/admin/messages");
        return { success: true };
    });
}

export async function updateContactPriority(id, priority) {
    return withErrorHandler(async () => {
        await requireAdmin();
        await repoUpdatePriority(id, priority);
        revalidatePath("/admin/messages");
        return { success: true };
    });
}

export async function replyToContact(contactId, replyData) {
    return withErrorHandler(async () => {
        const session = await requireAdmin();

        const adminUser = await getAdminUserByEmail(session.user.email);
        if (!adminUser) throw new Error("Admin user not found");

        const reply = await createContactReply({
            contactId,
            userId: adminUser.id,
            subject: replyData.subject,
            message: replyData.message,
            isAiGenerated: replyData.isAiGenerated || false,
            aiMode: replyData.aiMode || null,
        });

        await repoUpdateStatus(contactId, 'responded');

        if (replyData.sendEmail) {
            const contact = await getContactById(contactId);
            if (contact?.email) {
                await sendMail({
                    to: contact.email,
                    subject: replyData.subject,
                    html: `<p>${replyData.message.replace(/\n/g, '<br>')}</p>`,
                    text: replyData.message,
                });

                await updateContactReply(reply.id, { emailSent: true });
            }
        }

        revalidatePath("/admin/messages");
        revalidatePath(`/admin/messages/${contactId}`);
        return { replyId: reply.id };
    });
}
