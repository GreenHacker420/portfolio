import SocialLinkForm from "@/components/admin/forms/social-link-form";

export default function NewSocialLinkPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Add Social Link</h1>
                <p className="text-zinc-400">Add a new social media link.</p>
            </div>
            <SocialLinkForm />
        </div>
    );
}
