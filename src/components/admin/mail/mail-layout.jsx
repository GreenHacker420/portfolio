"use client";
import { cn } from "@/lib/utils";

export function MailLayout({ children, className }) {
    return (
        <div className={cn("flex h-full w-full overflow-hidden bg-black text-white", className)}>
            {children}
        </div>
    );
}

export function MailSidebarContainer({ children, className }) {
    return (
        <div className={cn("hidden lg:flex flex-col border-r border-zinc-800 duration-300 ease-in-out transition-all print:hidden", className)}>
            {children}
        </div>
    );
}

export function MailListContainer({ children, className }) {
    return (
        <div className={cn("w-full md:w-[320px] lg:w-[350px] flex flex-col border-r border-zinc-800 bg-zinc-950/50 print:hidden", className)}>
            {children}
        </div>
    )
}

export function MailDisplayContainer({ children, className }) {
    return (
        <div className={cn("flex-1 hidden md:flex flex-col h-full bg-zinc-950 print:flex print:w-full print:h-auto print:visible", className)}>
            {children}
        </div>
    )
}
