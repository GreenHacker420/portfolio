import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }) {
    const session = await getServerSession();

    if (!session) {
        redirect("/api/auth/signin"); // Redirect to NextAuth default signin
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white flex">
            <aside className="w-64 border-r border-neutral-800 p-6 flex flex-col">
                <h1 className="text-2xl font-bold mb-8 text-neutral-100">Admin Panel</h1>
                <nav className="flex-1 space-y-2">
                    <Link href="/admin" className="block px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800">
                        Dashboard
                    </Link>
                    <Link href="/admin/projects" className="block px-4 py-2 rounded-lg hover:bg-neutral-900 text-neutral-400 hover:text-white">
                        Projects
                    </Link>
                    <Link href="/admin/messages" className="block px-4 py-2 rounded-lg hover:bg-neutral-900 text-neutral-400 hover:text-white">
                        Messages
                    </Link>
                </nav>
                <div className="pt-6 border-t border-neutral-800">
                    <p className="text-sm text-neutral-500">Logged in as Admin</p>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
