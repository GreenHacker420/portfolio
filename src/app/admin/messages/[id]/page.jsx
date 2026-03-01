"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getContact, replyToContact, updateContactStatus, updateContactPriority } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
    ArrowLeft, Send, Mail, Clock, User, Tag, AlertTriangle,
    CheckCircle2, Archive, MessageSquare, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusStyles = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    responded: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    archived: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    spam: "bg-red-500/10 text-red-400 border-red-500/20",
};

const priorityStyles = {
    low: "bg-zinc-500/10 text-zinc-500",
    normal: "bg-blue-500/10 text-blue-400",
    high: "bg-orange-500/10 text-orange-400",
    urgent: "bg-red-500/10 text-red-400",
};

export default function MessageDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [replySubject, setReplySubject] = useState("");
    const [replyMessage, setReplyMessage] = useState("");
    const [sendingReply, setSendingReply] = useState(false);
    const [sendEmail, setSendEmail] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getContact(params.id);
            setContact(data);
            if (data) {
                setReplySubject(`Re: ${data.subject}`);
            }
            setLoading(false);
        }
        load();
    }, [params.id]);

    const handleReply = async () => {
        if (!replyMessage.trim()) {
            toast.error("Reply message is required");
            return;
        }
        setSendingReply(true);
        try {
            const result = await replyToContact(contact.id, {
                subject: replySubject,
                message: replyMessage,
                sendEmail,
            });
            if (result.success) {
                toast.success(sendEmail ? "Reply sent via email" : "Reply saved");
                setReplyMessage("");
                const updated = await getContact(params.id);
                setContact(updated);
            } else {
                toast.error("Failed to send reply: " + result.error);
            }
        } catch (error) {
            toast.error("Error sending reply");
        } finally {
            setSendingReply(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        await updateContactStatus(contact.id, newStatus);
        setContact({ ...contact, status: newStatus });
        toast.success(`Status updated to ${newStatus}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
            </div>
        );
    }

    if (!contact) {
        return (
            <div className="text-center py-12">
                <p className="text-zinc-500">Message not found.</p>
                <Button variant="ghost" onClick={() => router.push("/admin/messages")} className="mt-4">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Messages
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => router.push("/admin/messages")}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white">{contact.subject}</h1>
                    <p className="text-sm text-zinc-500">
                        From {contact.name} · {new Date(contact.createdAt).toLocaleString()}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className={cn("text-xs px-2.5 py-1 rounded-full border font-medium", statusStyles[contact.status])}>
                        {contact.status}
                    </span>
                    <span className={cn("text-xs px-2.5 py-1 rounded-full font-medium", priorityStyles[contact.priority])}>
                        {contact.priority}
                    </span>
                </div>
            </div>

            {/* Contact Info Card */}
            <Card className="bg-zinc-900/60 border-zinc-800 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-zinc-300">
                        <User className="w-4 h-4 text-zinc-500" /> {contact.name}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-300">
                        <Mail className="w-4 h-4 text-zinc-500" /> {contact.email}
                    </div>
                    {contact.company && (
                        <div className="flex items-center gap-2 text-zinc-300">
                            <Tag className="w-4 h-4 text-zinc-500" /> {contact.company}
                        </div>
                    )}
                    {contact.phone && (
                        <div className="flex items-center gap-2 text-zinc-300">
                            <MessageSquare className="w-4 h-4 text-zinc-500" /> {contact.phone}
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-zinc-300">
                        <Clock className="w-4 h-4 text-zinc-500" /> {new Date(contact.createdAt).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-300">
                        <AlertTriangle className="w-4 h-4 text-zinc-500" /> Type: {contact.inquiryType || "GENERAL"}
                    </div>
                </div>

                <div className="mt-5 pt-5 border-t border-zinc-800">
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Message</h3>
                    <div className="text-zinc-200 whitespace-pre-wrap leading-relaxed text-sm">
                        {contact.message}
                    </div>
                </div>

                {contact.projectDetails && (
                    <div className="mt-4 pt-4 border-t border-zinc-800">
                        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Project Details</h3>
                        <pre className="text-xs text-zinc-400 bg-zinc-950 p-3 rounded-lg overflow-x-auto">
                            {typeof contact.projectDetails === 'string'
                                ? contact.projectDetails
                                : JSON.stringify(contact.projectDetails, null, 2)}
                        </pre>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="mt-5 pt-5 border-t border-zinc-800 flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange("responded")}
                        className="border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                    >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Mark Responded
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange("archived")}
                        className="border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                    >
                        <Archive className="w-3.5 h-3.5 mr-1.5" /> Archive
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(contact.email).then(() => toast.success("Email copied"))}
                        className="border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                    >
                        <Mail className="w-3.5 h-3.5 mr-1.5" /> Copy Email
                    </Button>
                </div>
            </Card>

            {/* Reply Thread */}
            {contact.replies && contact.replies.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" /> Reply Thread ({contact.replies.length})
                    </h3>
                    <div className="space-y-3">
                        {contact.replies.map((reply) => (
                            <Card key={reply.id} className="bg-emerald-500/5 border-emerald-500/10 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] text-emerald-400 font-bold">
                                        A
                                    </div>
                                    <span className="text-xs text-emerald-400 font-medium">
                                        {reply.user?.name || reply.user?.email || 'Admin'}
                                    </span>
                                    <span className="text-[10px] text-zinc-600">
                                        {new Date(reply.createdAt).toLocaleString()}
                                    </span>
                                    {reply.emailSent && (
                                        <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20">
                                            Emailed
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-zinc-500 mb-1 font-medium">{reply.subject}</p>
                                <div className="text-sm text-zinc-300 whitespace-pre-wrap">{reply.message}</div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Compose Reply */}
            <Card className="bg-zinc-900/60 border-zinc-800 p-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Send className="w-4 h-4 text-emerald-500" /> Reply
                </h3>
                <div className="space-y-4">
                    <Input
                        placeholder="Subject"
                        value={replySubject}
                        onChange={(e) => setReplySubject(e.target.value)}
                        className="bg-zinc-950 border-zinc-800"
                    />
                    <Textarea
                        placeholder="Write your reply..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        rows={5}
                        className="bg-zinc-950 border-zinc-800 resize-none"
                    />
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={sendEmail}
                                onChange={(e) => setSendEmail(e.target.checked)}
                                className="rounded border-zinc-700"
                            />
                            Send via email (Graph API)
                        </label>
                        <Button
                            onClick={handleReply}
                            disabled={sendingReply || !replyMessage.trim()}
                            className="bg-emerald-500 hover:bg-emerald-600 text-black"
                        >
                            {sendingReply ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4 mr-2" />
                            )}
                            {sendingReply ? "Sending..." : "Send Reply"}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
