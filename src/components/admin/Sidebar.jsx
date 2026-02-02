
"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
    LayoutDashboard,
    FolderGit2,
    Briefcase,
    Cpu,
    GraduationCap,
    Award,
    Image as ImageIcon,
    MessageSquare, // For Contacts
    Mail, // For Email Service
    BrainCircuit, // For Knowledge Base
    User,
    Share2,
    HelpCircle,
    LogOut,
    Terminal
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

export default function AdminSidebar() {
    const [open, setOpen] = useState(false);

    const links = [
        {
            label: "Dashboard",
            href: "/admin",
            icon: (
                <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Profile",
            href: "/admin/personal-info",
            icon: (
                <User className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Projects",
            href: "/admin/projects",
            icon: (
                <FolderGit2 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Mail Service",
            href: "/admin/mail",
            icon: (
                <Mail className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Knowledge Base",
            href: "/admin/kb",
            icon: (
                <BrainCircuit className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Messages",
            href: "/admin/contacts",
            icon: (
                <MessageSquare className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Experience",
            href: "/admin/experience",
            icon: (
                <Briefcase className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Skills",
            href: "/admin/skills",
            icon: (
                <Cpu className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Education",
            href: "/admin/education",
            icon: (
                <GraduationCap className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Certifications",
            href: "/admin/certifications",
            icon: (
                <Award className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Media",
            href: "/admin/media",
            icon: (
                <ImageIcon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Socials",
            href: "/admin/social-links",
            icon: (
                <Share2 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "FAQs",
            href: "/admin/faqs",
            icon: (
                <HelpCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        }, 
        {
            label: "Templates",
            href: "/admin/templates",
            icon: (
                <Terminal className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        }
    ];

    return (
        <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between gap-10 bg-zinc-950 border-r border-zinc-800">
                <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    {open ? <Logo /> : <LogoIcon />}
                    <div className="mt-8 flex flex-col gap-2">
                        {links.map((link, idx) => (
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
