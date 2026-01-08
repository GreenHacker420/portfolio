import prisma from "../../../lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";


export const dynamic = 'force-dynamic';

export default async function AdminProjects() {
    // Fetch projects from DB
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Projects</h2>
                <Link href="/admin/projects/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                    <span>Add New</span>
                </Link>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-neutral-950 text-neutral-400">
                        <tr>
                            <th className="p-4 font-medium">Title</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Category</th>
                            <th className="p-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                        {projects.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-neutral-500">
                                    No projects found. Start by creating one!
                                </td>
                            </tr>
                        ) : (
                            projects.map((project) => (
                                <tr key={project.id} className="hover:bg-neutral-800/50">
                                    <td className="p-4 font-medium text-white">{project.title}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${project.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-neutral-800 text-neutral-400'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-neutral-400">{project.category}</td>
                                    <td className="p-4">
                                        <button className="text-blue-400 hover:text-blue-300 mr-4">Edit</button>
                                        <button className="text-red-400 hover:text-red-300">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
