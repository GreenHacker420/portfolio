import AdminSidebar from "@/components/admin/Sidebar";
import AdminContentWrapper from "@/components/admin/AdminContentWrapper";

export default function AdminLayout({ children }) {
    return (
        <div className="flex flex-col md:flex-row h-screen w-full bg-black text-zinc-100 font-sans selection:bg-emerald-500/30 overflow-hidden">
            <AdminSidebar />
            <AdminContentWrapper>
                {children}
            </AdminContentWrapper>
        </div>
    );
}
