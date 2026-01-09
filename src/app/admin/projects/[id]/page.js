
import React from 'react';
import prisma from '@/lib/db';
import ProjectForm from '@/components/admin/ProjectForm';

export default async function EditProjectPage(props) {
    const params = await props.params;

    const project = await prisma.project.findUnique({
        where: { id: params.id }
    });

    if (!project) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-red-500">Project not found</h1>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Edit Project</h1>
                <p className="text-neutral-400">Update project details.</p>
            </div>

            <div className="bg-neutral-900/50 border border-white/10 p-6 rounded-xl">
                <ProjectForm initialData={project} isEdit={true} />
            </div>
        </div>
    );
}
