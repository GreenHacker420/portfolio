
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DotBackground } from "@/components/ui/DotBackground";

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-black text-white font-sans">
            <AdminSidebar />
            <main className="flex-1 ml-64 min-h-screen relative">
                <DotBackground className="min-h-screen">
                    <div className="p-8 relative z-10">
                        {children}
                    </div>
                </DotBackground>
            </main>
        </div>
    );
}
