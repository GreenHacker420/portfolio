import { getProjects } from "@/actions/projects";
import { DataTable } from "@/components/admin/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ProjectsPage() {
    const result = await getProjects();
    const projects = result.success ? result.data : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Projects</h1>
                    <p className="text-zinc-500 mt-2">Manage your portfolio projects</p>
                </div>

                <Link href="/admin/projects/new">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Plus className="w-4 h-4 mr-2" /> Add Project
                    </Button>
                </Link>
            </div>

            <DataTable columns={columns} data={projects} searchKey="title" />
        </div>
    );
}
