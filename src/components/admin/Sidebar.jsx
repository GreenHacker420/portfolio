'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FolderGit2,
    Briefcase,
    Cpu,
    GraduationCap,
    Award,
    Image as ImageIcon,
    MessageSquare,
    User,
    Share2,
    HelpCircle,
    LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: User, label: 'Personal Info', href: '/admin/personal-info' },
    { icon: FolderGit2, label: 'Projects', href: '/admin/projects' },
    { icon: Briefcase, label: 'Experience', href: '/admin/experience' },
    { icon: Cpu, label: 'Skills', href: '/admin/skills' },
    { icon: GraduationCap, label: 'Education', href: '/admin/education' },
    { icon: Award, label: 'Certifications', href: '/admin/certifications' },
    { icon: ImageIcon, label: 'Media Library', href: '/admin/media' },
    { icon: MessageSquare, label: 'Messages', href: '/admin/contacts' },
    { icon: HelpCircle, label: 'FAQs', href: '/admin/faqs' },
    { icon: Share2, label: 'Social Links', href: '/admin/social-links' },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen fixed left-0 top-0 overflow-hidden">
            <div className="p-6 border-b border-zinc-800">
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                    Admin_Console
                </h1>
                <p className="text-xs text-zinc-500 mt-1">v2.0.0 // System Active</p>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_-5px_theme(colors.emerald.500)]"
                                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                            )}
                        >
                            <item.icon className={cn(
                                "w-4 h-4 transition-colors",
                                isActive ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300"
                            )} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-zinc-800 bg-zinc-950/50">
                <button
                    onClick={() => signOut({ callbackUrl: '/auth/sign-in' })}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Disconnect
                </button>
            </div>
        </aside>
    );
}
