"use client";

import { format } from "date-fns";
import {
    Archive,
    ArchiveX,
    Clock,
    Forward,
    MoreVertical,
    Reply,
    ReplyAll,
    Trash2,
    Printer,
    Star,
    Paperclip,
    Image as ImageIcon
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MailEditor } from "@/components/admin/mail/mail-editor";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { useMail } from "@/components/admin/mail/use-mail";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MailDisplay({ mail }) {
    const [replyText, setReplyText] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleReply = async () => {
        if (!mail || !replyText.trim()) return;
        setIsSending(true);
        try {
            // Simulate or Real API call
            const res = await fetch("/api/mail", {
                method: "POST",
                body: JSON.stringify({ messageId: mail.id, comment: replyText })
            });
            if (!res.ok) throw new Error("Failed");
            toast.success("Reply sent!");
            setReplyText("");
        } catch (e) {
            toast.error("Failed to send reply");
        } finally {
            setIsSending(false);
        }
    }

    if (!mail) {
        return (
            <div className="flex h-full w-full items-center justify-center p-8 text-muted-foreground bg-zinc-950/30">
                <div className="text-center space-y-2">
                    <div className="text-4xl">✉️</div>
                    <p>Select an email to read</p>
                </div>
            </div>
        );
    }

    const toolBarItems = [
        { icon: Archive, label: "Archive", onClick: () => toast.info("Archived (Demo)") },
        { icon: ArchiveX, label: "Move to junk", onClick: () => toast.info("Marked as Junk (Demo)") },
        { icon: Trash2, label: "Move to trash", onClick: () => toast.info("Deleted (Demo)") },
        { separator: true },
        { icon: Clock, label: "Snooze", onClick: () => toast.info("Snoozed (Demo)") },
        { icon: Star, label: "Star", onClick: () => toast.info("Starred (Demo)") },
        { separator: true },
        { icon: Printer, label: "Print", onClick: () => window.print() },
    ];

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center p-2 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 justify-between">
                <div className="flex items-center gap-1">
                    <TooltipProvider delayDuration={0}>
                        {toolBarItems.map((item, index) => (
                            item.separator ? (
                                <Separator key={index} orientation="vertical" className="mx-1 h-6 bg-zinc-800" />
                            ) : (
                                <Tooltip key={index}>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={item.onClick}>
                                            <item.icon className="h-4 w-4" />
                                            <span className="sr-only">{item.label}</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>{item.label}</TooltipContent>
                                </Tooltip>
                            )
                        ))}
                    </TooltipProvider>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Reply className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ReplyAll className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Forward className="h-4 w-4" />
                        </Button>
                    </div>
                    <Separator orientation="vertical" className="mx-1 h-6 bg-zinc-800" />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800 text-zinc-300">
                            <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                            <DropdownMenuItem>Add label</DropdownMenuItem>
                            <DropdownMenuItem>Mute thread</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="flex flex-1 flex-col">
                    <div className="flex items-start p-6 pb-0">
                        <div className="flex items-start gap-4 text-sm w-full">
                            <Avatar>
                                <AvatarImage alt={mail.from?.emailAddress?.name} />
                                <AvatarFallback>
                                    {mail.from?.emailAddress?.name
                                        .split(" ")
                                        .map((chunk) => chunk[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1 flex-1">
                                <div className="flex items-center justify-between">
                                    <div className="font-semibold text-base">{mail.from?.emailAddress?.name}</div>
                                    {mail.receivedDateTime && (
                                        <div className="text-xs text-muted-foreground">
                                            {format(new Date(mail.receivedDateTime), "PPpp")}
                                        </div>
                                    )}
                                </div>
                                <div className="line-clamp-1 text-xs text-muted-foreground">
                                    {mail.subject}
                                </div>
                                <div className="text-xs">
                                    <span className="font-medium text-emerald-500">To:</span> Me
                                </div>
                            </div>
                        </div>
                    </div>
                    <Separator className="mt-4 bg-zinc-800/50" />
                    <div className="flex-1 whitespace-pre-wrap p-6 text-sm text-zinc-300 font-serif leading-relaxed">
                        <div dangerouslySetInnerHTML={{ __html: mail.body?.content || mail.bodyPreview }} />
                    </div>
                </div>
            </ScrollArea>

            {/* Inline Reply Area */}
            <div className="p-4 bg-[#18181b] border-t border-zinc-800 mt-auto">
                <div className={cn(
                    "transition-all duration-300 ease-in-out border rounded-md overflow-hidden",
                    replyText || isSending ? "border-zinc-700 bg-[#1e1e1e]" : "border-zinc-800 bg-[#1e1e1e] hover:border-zinc-700 cursor-text"
                )}>
                    {!replyText && !isSending ? (
                        <div
                            className="flex items-center gap-3 p-3 text-zinc-400 hover:text-zinc-300"
                            onClick={() => setReplyText(" ")} // Trigger expansion
                        >
                            <Reply className="h-4 w-4" />
                            <span>Reply to {mail.from?.emailAddress?.name}...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col animate-in fade-in zoom-in-95 duration-200">
                            {/* Header of Reply Box */}
                            <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-[#252525]">
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-zinc-400 hover:text-white">
                                        <Reply className="h-3 w-3 mr-1" /> Reply
                                    </Button>
                                    <div className="w-px h-3 bg-zinc-700" />
                                    <span className="text-xs text-zinc-500">Draft</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => setReplyText("")} // Cancel/Collapse
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>

                            {/* Editor */}
                            <MailEditor
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Type your reply here..."
                                minHeight="150px"
                                className="border-0 rounded-none bg-transparent"
                                onTemplateSelect={(t) => setReplyText(t.body)}
                            />

                            {/* Footer Actions */}
                            <div className="flex items-center justify-between p-2 border-t border-zinc-800 bg-[#252525]">
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400">
                                        <Paperclip className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400">
                                        <ImageIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => setReplyText("")} className="text-zinc-400">Discard</Button>
                                    <Button
                                        size="sm"
                                        onClick={handleReply}
                                        disabled={isSending || !replyText.trim()}
                                        className="bg-[#0f6cbd] hover:bg-[#0f548c] text-white px-4 h-7"
                                    >
                                        {isSending ? "Sending..." : "Send"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
