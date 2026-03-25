
import { getSkillById } from "@/repositories/portfolio.repository";
import ProjectForm from "@/components/admin/ProjectForm";
import { notFound } from "next/navigation";

export default async function EditSkillPage({ params }) {
    const { id } = await params;
    const skill = await getSkillById(id);

    if (!skill) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Edit Skill</h1>
                <p className="text-zinc-400">Update skill details.</p>
            </div>

            <ProjectForm initialData={skill} type="skill" />
        </div>
    );
}
