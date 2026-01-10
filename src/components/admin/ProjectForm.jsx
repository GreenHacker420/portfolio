
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProjectForm({ initialData = {}, isEdit = false }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: initialData.title || '',
        description: initialData.description || '',
        techStack: initialData.techStack?.join(', ') || '',
        projectUrl: initialData.projectUrl || '',
        repoUrl: initialData.repoUrl || '',
        imageUrl: initialData.imageUrl || '',
        category: initialData.category || '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Convert techStack string to array
        const payload = {
            ...formData,
            techStack: formData.techStack.split(',').map(t => t.trim()).filter(Boolean),
        };

        try {
            const url = isEdit ? `/api/projects/${initialData.id}` : '/api/projects';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push('/admin/projects');
                router.refresh();
            } else {
                console.error("Failed");
                // Handle error
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="grid gap-4">
                <div>
                    <Label htmlFor="title">Project Title</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleChange} required className="bg-neutral-900 border-white/10" />
                </div>

                <div>
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" name="description" value={formData.description} onChange={handleChange} required className="bg-neutral-900 border-white/10" />
                </div>

                <div>
                    <Label htmlFor="techStack">Tech Stack (comma separated)</Label>
                    <Input id="techStack" name="techStack" value={formData.techStack} onChange={handleChange} placeholder="React, Node.js, Prisma" className="bg-neutral-900 border-white/10" />
                </div>

                <div>
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" value={formData.category || ''} onChange={handleChange} placeholder="Full Stack / Frontend / AI" className="bg-neutral-900 border-white/10" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="projectUrl">Live URL</Label>
                        <Input id="projectUrl" name="projectUrl" value={formData.projectUrl} onChange={handleChange} className="bg-neutral-900 border-white/10" />
                    </div>
                    <div>
                        <Label htmlFor="repoUrl">GitHub URL</Label>
                        <Input id="repoUrl" name="repoUrl" value={formData.repoUrl} onChange={handleChange} className="bg-neutral-900 border-white/10" />
                    </div>
                </div>

                <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="bg-neutral-900 border-white/10" />
                </div>
            </div>

            <div className="flex gap-4">
                <Button type="button" variant="ghost" onClick={() => router.back()} className="text-white hover:bg-white/10">Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-neon-green text-black hover:bg-neon-green/90 font-bold">
                    {loading ? 'Saving...' : (isEdit ? 'Update Project' : 'Create Project')}
                </Button>
            </div>
        </form>
    );
}
