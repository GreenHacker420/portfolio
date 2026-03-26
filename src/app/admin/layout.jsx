import AdminSidebar from "@/components/admin/Sidebar";
import AdminContentWrapper from "@/components/admin/AdminContentWrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AUTH_PATHS } from "@/config/constants";

export default async function AdminLayout({ children }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
        redirect(AUTH_PATHS.SIGN_IN);
    }

    return (
        <div className="flex flex-col md:flex-row h-screen w-full bg-black text-zinc-100 font-sans selection:bg-emerald-500/30 overflow-hidden scrollbar-hide">
            <AdminSidebar />
            <AdminContentWrapper>
                {children}
            </AdminContentWrapper>
        </div>
    );
}
