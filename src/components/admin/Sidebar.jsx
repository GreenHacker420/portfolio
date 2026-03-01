
"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
    LayoutDashboard,
    BarChart3,
    FolderGit2,
    Briefcase,
    FileCheck,
    Cpu,
    GraduationCap,
    Award,
    Image as ImageIcon,
    MessageSquare,
    Mail,
    BrainCircuit,
    User,
    Share2,
    HelpCircle,
    LogOut,
    Terminal,
    FileText,
    FileCode,
    Settings,
    Wand2,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

export default function AdminSidebar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const links = [
        {
            label: "Dashboard",
            href: "/admin",
            icon: <LayoutDashboard className="h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Analytics",
            href: "/admin/analytics",
            icon: <BarChart3 className="h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Profile",
            href: "/admin/personal-info",
            icon: <User className="h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Projects",
            href: "/admin/projects",
            icon: <FolderGit2 className="h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Mail Service",
            href: "/admin/mail",
            icon: <Mail className="h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Job Leads",
            href: "/admin/job-leads",
            icon: <Briefcase className="h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Applications",
            href: "/admin/applications",
            icon: <FileCheck className="h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Settings",
            href: "/admin/settings",
            icon: <Settings className="h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Knowledge Base",
            href: "/admin/kb",
            icon: <BrainCircuit className="h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Resumes",
            href: "/admin/resumes",
            icon: <FileText className="h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "GSOC Lab",
            href: "/admin/gsoc",
            icon: <Wand2 className="h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Messages",
            href: "/admin/messages",
            icon: <MessageSquare className="h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Experience",
            href: "/admin/experience",
            icon: <Briefcase className="h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Skills",
            href: "/admin/skills",
            icon: <Cpu className="h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Education",
            href: "/admin/education",
            icon: <GraduationCap className="h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Certifications",
            href: "/admin/certifications",
            icon: <Award className="h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Media",
            href: "/admin/media",
            icon: <ImageIcon className="h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Socials",
            href: "/admin/social-links",
            icon: <Share2 className="h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "FAQs",
            href: "/admin/faqs",
            icon: <HelpCircle className="h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Templates",
            href: "/admin/templates",
            icon: <FileCode className="h-5 w-5 flex-shrink-0" />,
        }
    ];

    // Active link highlighting
    const getIconClass = (href) => {
        const isActive = href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(href);
        return isActive
            ? "text-emerald-400"
            : "text-neutral-500 dark:text-neutral-400";
    };

    const linksWithActiveState = links.map(link => ({
        ...link,
        icon: React.cloneElement(link.icon, {
            className: cn(link.icon.props.className, getIconClass(link.href))
        }),
    }));

    return (
        <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between gap-10 bg-zinc-950 border-r border-zinc-800">
                <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    {open ? <Logo /> : <LogoIcon />}
                    <div className="mt-8 flex flex-col gap-2">
                        {linksWithActiveState.map((link, idx) => (
                            <SidebarLink key={idx} link={link} />
                        ))}

                        <div onClick={() => signOut({ callbackUrl: '/auth/sign-in' })} className="cursor-pointer">
                            <SidebarLink
                                link={{
                                    label: "Disconnect",
                                    href: "#",
                                    icon: <LogOut className="text-red-400 h-5 w-5 flex-shrink-0" />
                                }}
                                className="text-red-400 hover:text-red-300"
                            />
                        </div>

                    </div>
                </div>
                <div>
                    <SidebarLink
                        link={{
                            label: "Admin User",
                            href: "/admin/personal-info",
                            icon: (
                                <div className="h-7 w-7 flex-shrink-0 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold border border-emerald-500/50">
                                    A
                                </div>
                            ),
                        }}
                    />
                </div>
            </SidebarBody>
        </Sidebar>
    );
}

export const Logo = () => {
    return (
        <Link
            href="/admin"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-6 w-6 bg-zinc-900 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0 border border-zinc-800 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-emerald-500" />
            </div>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-lg text-white whitespace-pre"
            >
                Admin<span className="text-emerald-500">_Console</span>
            </motion.span>
        </Link>
    );
};

export const LogoIcon = () => {
    return (
        <Link
            href="/admin"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-6 w-6 bg-zinc-900 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0 border border-zinc-800 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-emerald-500" />
            </div>
        </Link>
    );
};
