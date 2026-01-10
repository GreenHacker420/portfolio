
'use client';
import React from 'react';
import ProjectForm from '@/components/admin/ProjectForm';

export default function NewProjectPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Create New Project</h1>
                <p className="text-neutral-400">Add a showcase item to your portfolio.</p>
            </div>

            <div className="bg-neutral-900/50 border border-white/10 p-6 rounded-xl">
                <ProjectForm />
            </div>
        </div>
    );
}
