
'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Settings, LogOut, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminSidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/projects", label: "Projects", icon: FolderKanban },
        { href: "/admin/messages", label: "Messages", icon: MessageSquare },
        { href: "/admin/settings", label: "Settings", icon: Settings },
    ];

    return (
        <aside className="w-64 border-r border-white/10 bg-neutral-900/50 min-h-screen p-6 flex flex-col fixed left-0 top-0 backdrop-blur-md z-50">
            <div className="text-2xl font-bold text-white mb-10 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-neon-green/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-neon-green animate-pulse" />
                </div>
                Admin<span className="text-neon-green">Panel</span>
            </div>

            <nav className="flex-1 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group",
                                isActive
                                    ? "bg-neon-green/10 text-neon-green"
                                    : "hover:bg-white/5 text-neutral-400 hover:text-white"
                            )}
                        >
                            <Icon size={20} className={cn("transition-colors", isActive ? "text-neon-green" : "group-hover:text-white")} />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <button className="flex items-center gap-3 px-4 py-3 mt-auto text-red-400 hover:bg-red-500/10 rounded-lg transition-colors w-full">
                <LogOut size={20} /> Logout
            </button>
        </aside>
    );
}
