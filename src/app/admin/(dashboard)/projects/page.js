
import React from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import Link from 'next/link';
import prisma from '@/lib/db';

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
                    <p className="text-neutral-400">Manage your portfolio projects.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/projects/new">
                        <Button className="bg-neon-green text-black hover:bg-neon-green/90 font-bold">
                            <Plus className="mr-2 h-4 w-4" /> Add Project
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-4">
                <div className="flex items-center mb-4">
                    {/* Search is purely visual for now, or we can implement server-side search later */}
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-500" />
                        <Input placeholder="Search projects..." className="pl-8 bg-neutral-900 border-white/10 text-white placeholder:text-neutral-500" />
                    </div>
                </div>

                <Table>
                    <TableCaption>A list of your featured projects.</TableCaption>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead className="text-neutral-400">Project Name</TableHead>
                            <TableHead className="text-neutral-400">Tech Stack</TableHead>
                            <TableHead className="text-neutral-400">Status</TableHead>
                            <TableHead className="text-right text-neutral-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-10 text-neutral-500">
                                    No projects found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            projects.map((project) => (
                                <TableRow key={project.id} className="border-white/10 hover:bg-white/5">
                                    <TableCell className="font-medium text-white">{project.title}</TableCell>
                                    <TableCell className="text-neutral-300">
                                        <div className="flex flex-wrap gap-1">
                                            {/* Defensive check for techStack array */}
                                            {(project.techStack || []).slice(0, 3).map((tech, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-white/5 rounded text-xs">{tech}</span>
                                            ))}
                                            {(project.techStack || []).length > 3 && <span className="text-xs text-neutral-500">+{project.techStack.length - 3}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-500 border border-green-500/20">
                                            {project.featured ? 'Featured' : 'Active'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/projects/${project.id}`}>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-white/10">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            {/* Delete needs to be a client component or server action. For now keeping UI. 
                            Ideally use a separate Client Component for the Delete button logic.
                        */}
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
