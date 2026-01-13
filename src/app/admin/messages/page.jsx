import { DataTable } from "@/components/admin/data-table";
import { columns } from "./columns";
import { getContacts } from "@/actions/contact";

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
    const data = await getContacts();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Messages</h1>
                    <p className="text-zinc-400">View messages from the contact form.</p>
                </div>
            </div>
            <DataTable columns={columns} data={data} searchKey="email" />
        </div>
    );
}
