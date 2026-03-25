import { SocialLinkForm } from "@/components/admin/forms/social-link-form";
import { getSocialLinkById } from "@/repositories/portfolio.repository";
import { notFound } from "next/navigation";

export default async function EditSocialLinkPage({ params }) {
    const resolvedParams = await params;
    const link = await getSocialLinkById(resolvedParams.id);


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
