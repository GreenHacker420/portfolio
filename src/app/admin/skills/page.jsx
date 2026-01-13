import { getSkills } from "@/actions/skills";
import { DataTable } from "@/components/admin/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function SkillsPage() {
    const result = await getSkills();
    const skills = result.success ? result.data : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Skills</h1>
                    <p className="text-zinc-500 mt-2">Manage your technical skills and proficiency</p>
                </div>

                <Link href="/admin/skills/new">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Plus className="w-4 h-4 mr-2" /> Add Skill
                    </Button>
                </Link>
            </div>

            <DataTable columns={columns} data={skills} searchKey="name" />
        </div>
    );
}
