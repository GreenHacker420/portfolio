import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/sign-in");
    }

    // Fetch contacts
    const contacts = await prisma.contact.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
    });

    return (
        <div className="min-h-screen bg-black text-white p-8 font-mono">
            <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <h1 className="text-2xl font-bold text-green-500">Admin_Dashboard.exe</h1>
                <div className="text-sm text-neutral-400">
                    User: {session.user.email}
                </div>
            </header>

            <main>
                <div className="border border-white/10 rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/5 uppercase text-neutral-500">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Message</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {contacts.map((contact) => (
                                <tr
                                    key={contact.id}
                                    className="hover:bg-white/5 transition-colors"
                                >
                                    <td className="px-6 py-4 text-neutral-400">
                                        {new Date(contact.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-white">
                                        {contact.name}
                                    </td>
                                    <td className="px-6 py-4 text-green-400">
                                        {contact.email}
                                    </td>
                                    <td className="px-6 py-4 text-neutral-300 max-w-md truncate">
                                        {contact.message}
                                    </td>
                                </tr>
                            ))}
                            {contacts.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-12 text-center text-neutral-500"
                                    >
                                        &gt; No incoming transmissions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
