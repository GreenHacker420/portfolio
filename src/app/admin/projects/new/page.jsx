import { ProjectForm } from "@/components/admin/forms/project-form";

export default function NewProjectPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Create Project</h1>
            </div>
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-6">
                <ProjectForm />
            </div>
        </div>
    );
}
