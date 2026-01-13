import SocialLinkForm from "@/components/admin/forms/social-link-form";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export default async function EditSocialLinkPage({ params }) {
    const { id } = await params;
    const link = await prisma.socialLink.findUnique({
        where: { id },
    });

    if (!link) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Edit Social Link</h1>
                <p className="text-zinc-400">Update your social media link.</p>
            </div>
            <SocialLinkForm initialData={link} />
        </div>
    );
}
