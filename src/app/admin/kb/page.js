
"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// Assuming Shadcn/UI components exist, if not we will fix imports or use basic HTML

export default function KnowledgeBasePage() {
    const [snippets, setSnippets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        content: "",
        source: "",
        tags: "",
    });
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchSnippets();
    }, []);

    const fetchSnippets = async () => {
        try {
            const res = await fetch("/api/admin/kb");
            const data = await res.json();
            setSnippets(data);
        } catch (error) {
            console.error("Failed to fetch snippets", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            await fetch(`/api/admin/kb/${id}`, { method: "DELETE" });
            setSnippets(snippets.filter((s) => s.id !== id));
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const handleSave = async () => {
        try {
            const payload = {
                content: formData.content,
                source: formData.source,
                tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
            };

            if (editingId) {
                // Update
                const res = await fetch(`/api/admin/kb/${editingId}`, {
                    method: "PUT",
                    body: JSON.stringify(payload),
                });
                const updated = await res.json();
                setSnippets(snippets.map((s) => (s.id === editingId ? updated : s)));
            } else {
                // Create
                const res = await fetch(`/api/admin/kb`, {
                    method: "POST",
                    body: JSON.stringify(payload),
                });
                const created = await res.json();
                setSnippets([created, ...snippets]);
            }
            resetForm();
        } catch (error) {
            console.error("Failed to save", error);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setIsCreating(false);
        setFormData({ content: "", source: "", tags: "" });
    };

    const startEdit = (snippet) => {
        setEditingId(snippet.id);
        setIsCreating(false);
        setFormData({
            content: snippet.content,
            source: snippet.source || "",
            tags: snippet.tags ? JSON.parse(snippet.tags).join(", ") : "",
        });
    };

    const handleSync = async () => {
        setIsSyncing(true);
        // TODO: Implement sync endpoint
        // await fetch("/api/admin/kb/sync", { method: "POST" });
        setTimeout(() => setIsSyncing(false), 1000); // Mock delay
        alert("Sync feature coming soon (needs embedding service setup)");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-100">Knowledge Base</h1>
                    <p className="text-zinc-400 mt-1">Manage content for the AI Assistant</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSync} disabled={isSyncing} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                        <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
                        Sync to AI
                    </Button>
                    <Button onClick={() => setIsCreating(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Snippet
                    </Button>
                </div>
            </div>

            {(isCreating || editingId) && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4 animate-in fade-in zoom-in-95">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-zinc-200">
                            {editingId ? "Edit Snippet" : "New Knowledge Snippet"}
                        </h3>
                        <Button size="icon" variant="ghost" onClick={resetForm}>
                            <X className="w-4 h-4 text-zinc-500" />
                        </Button>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Content</label>
                        <Textarea
                            placeholder="The core information..."
                            value={formData.content}
                            onChange={(e) =>
                                setFormData({ ...formData, content: e.target.value })
                            }
                            className="bg-zinc-950 border-zinc-800 text-zinc-200 min-h-[150px]"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Source</label>
                            <Input
                                placeholder="e.g., Resume, Project X"
                                value={formData.source}
                                onChange={(e) =>
                                    setFormData({ ...formData, source: e.target.value })
                                }
                                className="bg-zinc-950 border-zinc-800 text-zinc-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">
                                Tags (comma separated)
                            </label>
                            <Input
                                placeholder="tech, experience, bio"
                                value={formData.tags}
                                onChange={(e) =>
                                    setFormData({ ...formData, tags: e.target.value })
                                }
                                className="bg-zinc-950 border-zinc-800 text-zinc-200"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" onClick={resetForm} className="text-zinc-400 hover:text-zinc-200">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                            <Save className="w-4 h-4 mr-2" />
                            Save Snippet
                        </Button>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-20 text-zinc-500">Loading knowledge base...</div>
            ) : (
                <div className="grid gap-4">
                    {snippets.length === 0 && !isCreating ? (
                        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl">
                            <p className="text-zinc-500">No snippets found. Add some knowledge!</p>
                        </div>
                    ) : (
                        snippets.map((snippet) => (
                            <div
                                key={snippet.id}
                                className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4 hover:border-zinc-700 transition-colors group"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-2 flex-1">
                                        <p className="text-zinc-300 whitespace-pre-wrap font-mono text-sm">
                                            {snippet.content}
                                        </p>
                                        <div className="flex gap-2 items-center">
                                            {snippet.source && (
                                                <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                                                    {snippet.source}
                                                </span>
                                            )}
                                            {snippet.tags &&
                                                JSON.parse(snippet.tags).map((tag, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-xs px-2 py-1 rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-900/50"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => startEdit(snippet)}
                                            className="h-8 w-8 text-zinc-400 hover:text-white"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleDelete(snippet.id)}
                                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
