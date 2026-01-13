import { ExperienceForm } from "@/components/admin/forms/experience-form";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export default async function EditExperiencePage({ params }) {
    const resolvedParams = await params;
    const experience = await prisma.workExperience.findUnique({
        where: { id: resolvedParams.id }
    });

    if (!experience) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Edit Experience</h1>
            </div>
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-6">
                <ExperienceForm initialData={experience} />
            </div>
        </div>
    );
}
