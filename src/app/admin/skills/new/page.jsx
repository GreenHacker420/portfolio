import { SkillForm } from "@/components/admin/forms/skill-form";

export default function NewSkillPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Add New Skill</h1>
            </div>
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-6">
                <SkillForm />
            </div>
        </div>
    );
}
