
"use client";

import { useState, useEffect } from "react";
import { Loader2, RefreshCw, Send, Mail as MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function MailDashboard() {
    const [emails, setEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [replyText, setReplyText] = useState("");
    const [isSending, setIsSending] = useState(false);

    const fetchEmails = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/mail");
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Received non-JSON response from server");
            }
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setEmails(data.messages || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load emails: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEmails();
    }, []);

    const handleReply = async () => {
        if (!selectedEmail || !replyText.trim()) return;

        setIsSending(true);
        try {
            const res = await fetch("/api/mail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messageId: selectedEmail.id,
                    comment: replyText,
                }),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            toast.success("Reply sent successfully");
            setReplyText("");
        } catch (error) {
            console.error(error);
            toast.error("Failed to send reply");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden font-mono">
            {/* Sidebar List */}
            <div className="w-1/3 border-r border-green-500/20 flex flex-col">
                <div className="p-4 border-b border-green-500/20 flex justify-between items-center bg-green-500/5">
                    <h2 className="text-lg font-bold text-green-500 flex items-center gap-2">
                        <MailIcon className="w-5 h-5" /> INBOX
                    </h2>
                    <Button variant="ghost" size="icon" onClick={fetchEmails} disabled={isLoading}>
                        <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                    </Button>
                </div>

                <ScrollArea className="flex-1">
                    <div className="divide-y divide-green-500/10">
                        {emails.map((email) => (
                            <div
                                key={email.id}
                                onClick={() => setSelectedEmail(email)}
                                className={cn(
                                    "p-4 cursor-pointer hover:bg-green-500/5 transition-colors",
                                    selectedEmail?.id === email.id && "bg-green-500/10 border-l-2 border-green-500"
                                )}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={cn("font-medium truncate", !email.isRead && "text-green-400 font-bold")}>
                                        {email.from?.emailAddress?.name || email.from?.emailAddress?.address}
                                    </span>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                        {new Date(email.receivedDateTime).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="font-semibold text-sm truncate mb-1">{email.subject}</div>
                                <div className="text-xs text-muted-foreground line-clamp-2">
                                    {email.bodyPreview}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Detail View */}
            <div className="flex-1 flex flex-col">
                {selectedEmail ? (
                    <>
                        <div className="p-6 border-b border-green-500/20 bg-green-500/5">
                            <h1 className="text-xl font-bold mb-2">{selectedEmail.subject}</h1>
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <div>
                                    <span className="text-green-500">From:</span> {selectedEmail.from?.emailAddress?.name} &lt;{selectedEmail.from?.emailAddress?.address}&gt;
                                </div>
                                <div>
                                    {new Date(selectedEmail.receivedDateTime).toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <ScrollArea className="flex-1 p-6">
                            <div
                                className="prose prose-invert prose-sm max-w-none text-gray-300"
                                dangerouslySetInnerHTML={{ __html: selectedEmail.body?.content || selectedEmail.bodyPreview }}
                            />
                        </ScrollArea>

                        {/* Reply Section */}
                        <div className="p-4 border-t border-green-500/20 bg-background">
                            <Textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Type your reply here..."
                                className="min-h-[100px] mb-4 bg-green-500/5 border-green-500/20 focus:border-green-500"
                            />
                            <div className="flex justify-end">
                                <Button onClick={handleReply} disabled={isSending || !replyText.trim()} className="gap-2">
                                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    Send Reply
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        Select an email to view details
                    </div>
                )}
            </div>
        </div>
    );
}
