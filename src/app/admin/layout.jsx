import AdminSidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-black text-zinc-100 font-sans selection:bg-emerald-500/30">
            <AdminSidebar />

            <main className="flex-1 ml-64 p-8 overflow-y-auto max-h-screen">
                <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
