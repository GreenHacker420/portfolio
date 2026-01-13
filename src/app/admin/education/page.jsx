import { DataTable } from "@/components/admin/data-table";
import { columns } from "./columns";
import { getEducation } from "@/actions/education";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function EducationPage() {
    const data = await getEducation();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Education</h1>
                    <p className="text-zinc-400">Manage your educational background.</p>
                </div>
                <Button asChild className="bg-white text-black hover:bg-zinc-200">
                    <Link href="/admin/education/new">
                        <Plus className="mr-2 h-4 w-4" /> Add Education
                    </Link>
                </Button>
            </div>
            <DataTable columns={columns} data={data} searchKey="institution" />
        </div>
    );
}
