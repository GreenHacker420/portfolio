import { getExperience } from "@/actions/experience";
import { DataTable } from "@/components/admin/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ExperiencePage() {
    const result = await getExperience();
    const data = result.success ? result.data : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Work Experience</h1>
                    <p className="text-zinc-500 mt-2">Manage your professional journey</p>
                </div>

                <Link href="/admin/experience/new">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Plus className="w-4 h-4 mr-2" /> Add Experience
                    </Button>
                </Link>
            </div>

            <DataTable columns={columns} data={data} searchKey="company" />
        </div>
    );
}
