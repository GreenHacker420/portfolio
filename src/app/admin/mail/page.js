"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useMail } from "@/components/admin/mail/use-mail";
import { MailLayout, MailListContainer, MailDisplayContainer, MailSidebarContainer } from "@/components/admin/mail/mail-layout";
import { MailList } from "@/components/admin/mail/mail-list";
import { MailDisplay } from "@/components/admin/mail/mail-display";
import { ComposeDialog } from "@/components/admin/mail/compose-dialog";
import { cn } from "@/lib/utils";
import { Inbox, Send, Archive, Trash2, File, ChevronLeft, ChevronRight, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MailPage() {
    const { mails, setMails, selected, setSelected, isLoading, setIsLoading, mailFolder, setMailFolder } = useMail();
    const [navCollapsed, setNavCollapsed] = useState(false);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [isMockData, setIsMockData] = useState(false);

    useEffect(() => {
        const fetchEmails = async () => {
            setIsLoading(true);
            setIsMockData(false);
            try {
                const res = await fetch(`/api/mail?folder=${mailFolder}`);
                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Received non-JSON response from server");
                }
                const data = await res.json();

                // Detect mock data fallback
                if (data.error) {
                    setIsMockData(true);
                }

                // Use actual Graph API categories instead of fake labels
                const processedMails = (data.messages || []).map(m => ({
                    ...m,
                    labels: m.categories || []
                }));

                setMails(processedMails);
                setSelected(null);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load emails: " + error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmails();
    }, [setMails, setSelected, setIsLoading, mailFolder]);

    const selectedMail = mails.find((item) => item.id === selected) || null;

    return (
        <div className="h-full w-full overflow-hidden bg-black/50 backdrop-blur-xl">
            {isMockData && (
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border-b border-yellow-500/20 text-yellow-400 text-xs">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Graph API unavailable — showing mock data. Configure Azure credentials in Settings.</span>
                </div>
            )}
            <MailLayout>
                {/* Left Sidebar (Folders) */}
                <MailSidebarContainer className={cn(navCollapsed ? "w-[50px]" : "w-[240px]")}>
                    <div className={cn("flex h-[52px] items-center justify-center border-b border-zinc-800 px-2", navCollapsed ? "h-[52px]" : "px-4")}>
                        <div className="font-bold text-emerald-500 flex items-center gap-2 w-full">
                            {!navCollapsed && <span className="text-xl">⌘</span>}
                            {!navCollapsed && <span className="flex-1">Mail</span>}
                            <Button variant="ghost" size="icon" className="ml-auto h-6 w-6" onClick={() => setNavCollapsed(!navCollapsed)}>
                                {navCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                    <div className="p-2 space-y-1">
                        <div className="mb-4">
                            <Button
                                onClick={() => setIsComposeOpen(true)}
                                className={cn(
                                    "w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 transition-all",
                                    navCollapsed ? "justify-center px-0 h-10 w-10 rounded-full" : "justify-start"
                                )}
                            >
                                <PenSquare className="h-4 w-4" />
                                {!navCollapsed && "New Message"}
                            </Button>
                        </div>

                        <NavButton
                            icon={<Inbox className="w-4 h-4" />}
                            label="Inbox"
                            count={mails.filter(m => !m.isRead).length}
                            active={mailFolder === 'inbox'}
                            onClick={() => setMailFolder('inbox')}
                            collapsed={navCollapsed}
                        />
                        <NavButton
                            icon={<Send className="w-4 h-4" />}
                            label="Sent"
                            active={mailFolder === 'sent'}
                            onClick={() => setMailFolder('sent')}
                            collapsed={navCollapsed}
                        />
                        <NavButton
                            icon={<File className="w-4 h-4" />}
                            label="Drafts"
                            active={mailFolder === 'drafts'}
                            onClick={() => setMailFolder('drafts')}
                            collapsed={navCollapsed}
                        />
                        <NavButton
                            icon={<Archive className="w-4 h-4" />}
                            label="Archive"
                            active={mailFolder === 'archive'}
                            onClick={() => setMailFolder('archive')}
                            collapsed={navCollapsed}
                        />
                        <NavButton
                            icon={<Trash2 className="w-4 h-4" />}
                            label="Trash"
                            active={mailFolder === 'trash'}
                            onClick={() => setMailFolder('trash')}
                            collapsed={navCollapsed}
                        />
                    </div>
                </MailSidebarContainer>

                {/* Middle (List) */}
                <MailListContainer>
                    <MailList items={mails} />
                </MailListContainer>

                {/* Right (Display) */}
                <MailDisplayContainer>
                    <MailDisplay mail={selectedMail} />
                </MailDisplayContainer>
            </MailLayout>

            <ComposeDialog open={isComposeOpen} onOpenChange={setIsComposeOpen} />
        </div>
    );
}

function NavButton({ icon, label, count, active, collapsed, onClick }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-800",
                active ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white",
                collapsed && "justify-center px-2"
            )}
        >
            {icon}
            {!collapsed && (
                <>
                    <span className="flex-1 text-left">{label}</span>
                    {count > 0 && (
                        <span className="ml-auto text-xs text-emerald-500">{count}</span>
                    )}
                </>
            )}
        </button>
    );
}
