import { SkillForm } from "@/components/admin/forms/skill-form";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export default async function EditSkillPage({ params }) {
    const resolvedParams = await params;
    const skill = await prisma.skill.findUnique({
        where: { id: resolvedParams.id }
    });

    if (!skill) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Edit Skill</h1>
            </div>
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-6">
                <SkillForm initialData={skill} />
            </div>
        </div>
    );
}
