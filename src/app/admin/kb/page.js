
"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Edit2, Save, X, RefreshCw, Loader2, Database, AlertTriangle, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner"; // Assuming sonner or generic toast, if not will use alert fallback

export default function KnowledgeBasePage() {
    const [snippets, setSnippets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        try {
            // Dynamically import pdfjs-dist
            const pdfJS = await import('pdfjs-dist/build/pdf');

            // Set worker source to CDN to avoid webpack issues
            pdfJS.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfJS.version}/build/pdf.worker.min.mjs`;

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfJS.getDocument({ data: arrayBuffer }).promise;

            let fullText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(" ");
                fullText += pageText + "\n";
            }

            if (!fullText || fullText.length < 50) {
                alert("Could not extract enough text from the PDF.");
                setIsUploading(false);
                return;
            }

            // Send extracted text to backend
            const res = await fetch("/api/admin/kb/resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: fullText }),
            });
            const data = await res.json();

            if (res.ok) {
                alert(data.message);
                fetchSnippets();
            } else {
                alert("Upload failed: " + data.error);
            }
        } catch (error) {
            console.error("Upload error", error);
            alert("Upload failed: " + error.message);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // Modal States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        content: "",
        source: "",
        tags: "",
    });

    useEffect(() => {
        fetchSnippets();
    }, []);

    const fetchSnippets = async () => {
        try {
            const res = await fetch("/api/admin/kb");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setSnippets(data);
        } catch (error) {
            console.error("Failed to fetch snippets", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const res = await fetch("/api/admin/kb/sync", { method: "POST" });
            const data = await res.json();
            if (res.ok) {
                alert(data.message); // Replace with toast if available
            } else {
                alert("Sync Failed: " + data.error);
            }
        } catch (error) {
            alert("Sync Failed: " + error.message);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleSave = async () => {
        try {
            const payload = {
                content: formData.content,
                source: formData.source,
                tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
            };

            const url = editingId ? `/api/admin/kb/${editingId}` : "/api/admin/kb";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to save");

            const saved = await res.json();

            if (editingId) {
                setSnippets(snippets.map((s) => (s.id === editingId ? saved : s)));
            } else {
                setSnippets([saved, ...snippets]);
            }

            closeDialog();
        } catch (error) {
            console.error("Failed to save", error);
            alert("Failed to save snippet");
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await fetch(`/api/admin/kb/${deleteId}`, { method: "DELETE" });
            setSnippets(snippets.filter((s) => s.id !== deleteId));
            setDeleteId(null);
        } catch (error) {
            console.error("Failed to delete", error);
            alert("Failed to delete");
        }
    };

    const openCreateDialog = () => {
        setEditingId(null);
        setFormData({ content: "", source: "", tags: "" });
        setIsDialogOpen(true);
    };

    const openEditDialog = (snippet) => {
        setEditingId(snippet.id);
        let tags = "";
        try {
            tags = snippet.tags ? JSON.parse(snippet.tags).join(", ") : "";
        } catch (e) {
            tags = snippet.tags || "";
        }
        setFormData({
            content: snippet.content,
            source: snippet.source || "",
            tags: tags,
        });
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setEditingId(null);
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-2">
                        <Database className="w-8 h-8 text-emerald-500" />
                        Knowledge Base
                    </h1>
                    <p className="text-zinc-400 mt-1">Manage the brain of your AI Assistant.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
                        {isSyncing ? "Syncing..." : "Sync to AI"}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={async () => {
                            if (!confirm("Import seed data? This will add duplicates if run twice.")) return;
                            try {
                                const res = await fetch("/api/admin/kb/seed", { method: "POST" });
                                const data = await res.json();
                                alert(data.message);
                                fetchSnippets();
                            } catch (e) { alert("Import failed"); }
                        }}
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    >
                        <Database className="w-4 h-4 mr-2" />
                        Import Data
                    </Button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".pdf"
                        className="hidden"
                    />
                    <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    >
                        {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                        {isUploading ? "Parsing..." : "Upload Resume"}
                    </Button>

                    <Button onClick={openCreateDialog} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Snippet
                    </Button>
                </div>
            </div>

            {/* List View */}
            {isLoading ? (
                <div className="flex items-center justify-center h-64 border border-dashed border-zinc-800 rounded-xl">
                    <div className="flex flex-col items-center gap-2 text-zinc-500">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <p>Loading knowledge...</p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4">
                    {snippets.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                            <Database className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-zinc-300">No snippets found</h3>
                            <p className="text-zinc-500 max-w-sm mx-auto mt-2">
                                Your Knowledge Base is empty. Add snippets from your resume or projects to help the AI answer questions.
                            </p>
                            <Button onClick={openCreateDialog} variant="outline" className="mt-6 border-zinc-700">
                                Create First Snippet
                            </Button>
                        </div>
                    ) : (
                        snippets.map((snippet) => (
                            <div
                                key={snippet.id}
                                className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-5 hover:border-zinc-700 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-gradient-to-l from-zinc-900/90 to-transparent pl-8">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => openEditDialog(snippet)}
                                        className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setDeleteId(snippet.id)}
                                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex gap-2 items-center flex-wrap">
                                        {snippet.source && (
                                            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 font-semibold">
                                                {snippet.source}
                                            </span>
                                        )}
                                        {snippet.tags && (() => {
                                            try {
                                                const parsed = JSON.parse(snippet.tags);
                                                return Array.isArray(parsed) ? parsed.map((tag, i) => (
                                                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-900/50">
                                                        #{tag}
                                                    </span>
                                                )) : null;
                                            } catch (e) {
                                                return null;
                                            }
                                        })()}
                                    </div>
                                    <p className="text-zinc-300 whitespace-pre-wrap font-mono text-sm leading-relaxed pr-8">
                                        {snippet.content}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50 sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Snippet" : "Add Knowledge"}</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Add information to your portfolio's brain. The AI will use this to answer questions.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Content</label>
                            <Textarea
                                placeholder="Paste relevant info here (e.g. 'I have 5 years of experience in React...')"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="bg-zinc-900 border-zinc-800 text-zinc-100 min-h-[150px] focus-visible:ring-emerald-500/50"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Source (Optional)</label>
                                <Input
                                    placeholder="e.g. Resume"
                                    value={formData.source}
                                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                    className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-emerald-500/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Tags (Comma sep)</label>
                                <Input
                                    placeholder="frontend, experience"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    className="bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-emerald-500/50"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={closeDialog} className="text-zinc-400 hover:text-white">Cancel</Button>
                        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white">Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Alert */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this snippet?</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">
                            This action cannot be undone. This snippet will be removed from the database and the AI search index on next sync.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white border-0">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
