
import { DataTable } from "@/components/admin/data-table";
import { columns } from "./columns";
import { getContacts } from "@/actions/contact";

export const dynamic = 'force-dynamic';

export default async function ContactsPage() {
    const data = await getContacts();

    return (
        <div className="container mx-auto py-10 text-white">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Messages</h1>
            </div>

            <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-neutral-800 p-6">
                <DataTable columns={columns} data={data} searchKey="email" />
            </div>
        </div>
    );
}
