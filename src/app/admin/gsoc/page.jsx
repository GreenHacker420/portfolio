"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, FileText, Loader2, Wand2, Trash2 } from "lucide-react";
import AdminContentWrapper from "@/components/admin/AdminContentWrapper";

export default function GsocListPage() {
    const [proposals, setProposals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/proposals")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setProposals(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Failed to load proposals:", error);
                setIsLoading(false);
            });
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Delete this proposal?")) return;
        try {
            await fetch(`/api/admin/proposals/${id}`, { method: "DELETE" });
            setProposals((prev) => prev.filter((proposal) => proposal.id !== id));
        } catch (error) {
            console.error("Failed to delete proposal:", error);
        }
    };

    return (
        <AdminContentWrapper
            title="GSOC Proposal Lab"
            actions={
                <Link href="/admin/gsoc/new">
                    <Button className="bg-emerald-500 text-black hover:bg-emerald-400">
                        <Plus className="h-4 w-4 mr-2" />
                        New Proposal
                    </Button>
                </Link>
            }
        >
            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                </div>
            ) : proposals.length === 0 ? (
                <div className="h-64 rounded-xl border border-dashed border-zinc-800 flex flex-col items-center justify-center">
                    <Wand2 className="h-10 w-10 text-zinc-700 mb-3" />
                    <p className="text-zinc-400 font-medium">No GSOC proposals yet</p>
                    <p className="text-zinc-600 text-sm">Create one and use AI outline + critique tools.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {proposals.map((proposal) => (
                        <Card key={proposal.id} className="bg-zinc-900 border-zinc-800">
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="h-9 w-9 rounded-lg border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center">
                                        <FileText className="h-4 w-4 text-emerald-400" />
                                    </div>
                                    <span className="text-[10px] px-2 py-0.5 rounded border border-zinc-700 text-zinc-500">
                                        {proposal.program}
                                    </span>
                                </div>
                                <h3 className="text-zinc-100 font-semibold line-clamp-2">{proposal.title}</h3>
                                <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{proposal.organization || "No organization set"}</p>
                                <p className="text-xs text-zinc-600 mt-3">
                                    Updated {new Date(proposal.updatedAt).toLocaleDateString()} • Versions {proposal?._count?.versions ?? 0}
                                </p>
                                <div className="mt-4 flex gap-2">
                                    <Link href={`/admin/gsoc/${proposal.id}`} className="flex-1">
                                        <Button variant="outline" className="w-full border-zinc-700">Open</Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        onClick={() => handleDelete(proposal.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </AdminContentWrapper>
    );
}
