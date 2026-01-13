import { ProjectForm } from "@/components/admin/forms/project-form";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

// Next.js 15: params is async
export default async function EditProjectPage({ params }) {
    // Await params in case it's a promise (Next 15)
    const resolvedParams = await params;
    const project = await prisma.project.findUnique({
        where: { id: resolvedParams.id }
    });

    if (!project) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Edit Project</h1>
            </div>
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-6">
                <ProjectForm initialData={project} />
            </div>
        </div>
    );
}
