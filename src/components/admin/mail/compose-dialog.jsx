"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { MailEditor } from "@/components/admin/mail/mail-editor";

export function ComposeDialog({ open, onOpenChange }) {
    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
        if (!to || !subject || !body) {
            toast.error("Please fill all fields");
            return;
        }

        setIsSending(true);
        try {
            const res = await fetch("/api/mail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to,
                    subject,
                    body
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to send");
            }

            toast.success("Email sent successfully!");
            onOpenChange(false);
            setTo("");
            setSubject("");
            setBody("");
        } catch (error) {
            console.error(error);
            toast.error("Failed to send: " + error.message);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] p-0 gap-0 bg-[#1e1e1e] border-zinc-800 text-zinc-100 overflow-hidden shadow-2xl block">
                <DialogHeader className="sr-only">
                    <DialogTitle>New Message</DialogTitle>
                </DialogHeader>

                {/* Outlook Header: Send Buttons */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#252525] border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleSend}
                                disabled={isSending}
                                className="h-8 bg-[#0f6cbd] hover:bg-[#0f548c] text-white gap-2 px-4 rounded-md font-normal text-sm"
                            >
                                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                                Send
                            </Button>
                            <Button variant="ghost" className="h-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800" onClick={() => onOpenChange(false)}>
                                Discard
                            </Button>
                        </div>
                    </div>
                    <div className="text-zinc-500 text-xs text-right">Draft saved</div>
                </div>

                {/* Form Fields - Outlook Style */}
                <div className="px-6 pt-4 pb-2 space-y-2 bg-[#1e1e1e]">
                    <div className="flex items-center gap-4 border-b border-zinc-700/50 pb-1">
                        <Label htmlFor="to" className="text-zinc-400 font-normal w-[60px] cursor-pointer hover:underline decoration-zinc-500">To</Label>
                        <Input
                            id="to"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="flex-1 border-0 bg-transparent focus-visible:ring-0 px-0 h-9 text-base shadow-none"
                            autoComplete="off"
                        />
                    </div>
                    <div className="flex items-center gap-4 border-b border-zinc-700/50 pb-1">
                        <Label htmlFor="subject" className="text-zinc-400 font-normal w-[60px]">Subject</Label>
                        <Input
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="flex-1 border-0 bg-transparent focus-visible:ring-0 px-0 h-9 text-base font-medium shadow-none"
                            autoComplete="off"
                        />
                    </div>
                </div>

                {/* Editor - Full Height */}
                <div className="px-6 pb-6 bg-[#1e1e1e]">
                    <MailEditor
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Type / to insert files and more"
                        minHeight="350px"
                        className="border-0 bg-transparent"
                        onTemplateSelect={(t) => {
                            setSubject(t.subject);
                            setBody(t.body);
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
