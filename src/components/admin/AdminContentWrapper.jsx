"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminContentWrapper({ children }) {
    const pathname = usePathname();
    const isMailPage = pathname?.startsWith("/admin/mail");

    return (
        <main
            className={cn(
                "flex-1 h-full min-h-0 min-w-0 overflow-y-auto",
                isMailPage ? "p-0 overflow-hidden" : "p-8"
            )}
        >
            <div
                className={cn(
                    "mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500",
                    isMailPage ? "h-full" : "max-w-7xl pb-20"
                )}
            >
                {children}
            </div>
        </main>
    );
}
