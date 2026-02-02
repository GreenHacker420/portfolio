import AdminSidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }) {
    return (
        <div className="flex flex-col md:flex-row h-screen w-full bg-black text-zinc-100 font-sans selection:bg-emerald-500/30 overflow-hidden">
            <AdminSidebar />

            <main className="flex-1 h-full min-h-0 min-w-0 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                    {children}
                </div>
            </main>
        </div>
    );
}
