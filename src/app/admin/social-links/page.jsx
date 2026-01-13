import { DataTable } from "@/components/admin/data-table";
import { columns } from "./columns";
import { getSocialLinks } from "@/actions/social-links";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function SocialLinksPage() {
    const data = await getSocialLinks();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Social Links</h1>
                    <p className="text-zinc-400">Manage your social media presence.</p>
                </div>
                <Button asChild className="bg-white text-black hover:bg-zinc-200">
                    <Link href="/admin/social-links/new">
                        <Plus className="mr-2 h-4 w-4" /> Add Social Link
                    </Link>
                </Button>
            </div>
            <DataTable columns={columns} data={data} searchKey="platform" />
        </div>
    );
}
