import { ExperienceForm } from "@/components/admin/forms/experience-form";

export default function NewExperiencePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Add Experience</h1>
            </div>
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-6">
                <ExperienceForm />
            </div>
        </div>
    );
}
