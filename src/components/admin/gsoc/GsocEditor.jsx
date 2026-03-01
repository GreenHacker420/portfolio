"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    Save,
    Sparkles,
    Wand2,
    ClipboardCheck,
    RotateCcw,
    History,
    FileDown
} from "lucide-react";
import { createDefaultProposalData, ensureProposalData } from "@/lib/proposals/defaults";

const TONES = ["academic", "technical", "humanized", "concise", "confident"];

export default function GsocEditor({ proposalId }) {
    const router = useRouter();
    const isNewProposal = proposalId === "new";

    const [title, setTitle] = useState("GSOC Proposal");
    const [organization, setOrganization] = useState("");
    const [projectIdea, setProjectIdea] = useState("");
    const [tone, setTone] = useState("academic");
    const [data, setData] = useState(createDefaultProposalData());
    const [selectedSectionKey, setSelectedSectionKey] = useState("problem_statement");
    const [aiInstruction, setAiInstruction] = useState("Make this section more concrete with implementation details and measurable impact.");
    const [versions, setVersions] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
    const [isGeneratingSection, setIsGeneratingSection] = useState(false);
    const [isCritiquing, setIsCritiquing] = useState(false);
    const [isLoadingVersions, setIsLoadingVersions] = useState(false);
    const [restoringVersionId, setRestoringVersionId] = useState(null);

    const selectedSection = useMemo(
        () => data.sections.find((section) => section.key === selectedSectionKey) || data.sections[0],
        [data, selectedSectionKey]
    );

    useEffect(() => {
        if (isNewProposal) {
            setData(createDefaultProposalData());
            setIsLoading(false);
            return;
        }

        const load = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/admin/proposals/${proposalId}`);
                const proposal = await res.json();
                if (proposal?.id) {
                    hydrateFromProposal(proposal);
                }
            } catch (error) {
                console.error("Failed to load proposal:", error);
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, [proposalId, isNewProposal]);

    useEffect(() => {
        if (isNewProposal) return;
        loadVersions();
    }, [proposalId, isNewProposal]);

    const hydrateFromProposal = (proposal) => {
        setTitle(proposal.title || "GSOC Proposal");
        setOrganization(proposal.organization || "");
        setProjectIdea(proposal.projectIdea || "");
        setTone(proposal.tone || "academic");
        const normalized = ensureProposalData(proposal.data, {
            title: proposal.title || "GSOC Proposal",
            organization: proposal.organization || "",
            projectIdea: proposal.projectIdea || ""
        });
        setData(normalized);

        if (!normalized.sections.some((section) => section.key === selectedSectionKey)) {
            setSelectedSectionKey(normalized.sections[0]?.key || "problem_statement");
        }
    };

    const loadVersions = async () => {
        if (isNewProposal) return;
        setIsLoadingVersions(true);
        try {
            const res = await fetch(`/api/admin/proposals/${proposalId}/versions?limit=20`);
            const payload = await res.json();
            if (Array.isArray(payload)) setVersions(payload);
        } catch (error) {
            console.error("Failed to load proposal versions:", error);
        } finally {
            setIsLoadingVersions(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        const method = isNewProposal ? "POST" : "PUT";
        const url = isNewProposal ? "/api/admin/proposals" : `/api/admin/proposals/${proposalId}`;

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    organization,
                    projectIdea,
                    tone,
                    data,
                    source: "manual"
                })
            });
            const payload = await res.json();

            if (payload?.id && isNewProposal) {
                router.push(`/admin/gsoc/${payload.id}`);
                return;
            }

            if (payload?.id) {
                hydrateFromProposal(payload);
                await loadVersions();
            }
        } catch (error) {
            console.error("Failed to save proposal:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleGenerateOutline = async () => {
        if (isNewProposal) return;
        setIsGeneratingOutline(true);
        try {
            const res = await fetch("/api/admin/proposals/outline", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ proposalId })
            });
            const payload = await res.json();
            if (payload?.proposal) {
                hydrateFromProposal(payload.proposal);
                await loadVersions();
            }
        } catch (error) {
            console.error("Failed to generate outline:", error);
        } finally {
            setIsGeneratingOutline(false);
        }
    };

    const handleGenerateSection = async () => {
        if (isNewProposal || !selectedSection) return;
        setIsGeneratingSection(true);
        try {
            const res = await fetch("/api/admin/proposals/section", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    proposalId,
                    sectionKey: selectedSection.key,
                    instruction: aiInstruction,
                    tone
                })
            });
            const payload = await res.json();
            if (payload?.proposal) {
                hydrateFromProposal(payload.proposal);
                await loadVersions();
            }
        } catch (error) {
            console.error("Failed to generate section:", error);
        } finally {
            setIsGeneratingSection(false);
        }
    };

    const handleCritique = async () => {
        if (isNewProposal) return;
        setIsCritiquing(true);
        try {
            const res = await fetch("/api/admin/proposals/critique", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ proposalId })
            });
            const payload = await res.json();
            if (payload?.proposal) {
                hydrateFromProposal(payload.proposal);
                await loadVersions();
            }
        } catch (error) {
            console.error("Failed to critique proposal:", error);
        } finally {
            setIsCritiquing(false);
        }
    };

    const updateSelectedSectionContent = (nextContent) => {
        setData((prev) => ({
            ...prev,
            sections: prev.sections.map((section) =>
                section.key === selectedSection.key ? { ...section, content: nextContent } : section
            )
        }));
    };

    const handleExportMarkdown = () => {
        const markdown = [
            `# ${title}`,
            `> Program: GSOC`,
            organization ? `> Organization: ${organization}` : "",
            "",
            projectIdea ? `## Project Idea\n${projectIdea}\n` : "",
            ...data.sections.map((section) => `## ${section.title}\n${section.content || "_Pending_"}\n`)
        ].join("\n");

        const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "gsoc-proposal"}.md`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    };

    if (isLoading) {
        return (
            <div className="h-[calc(100vh-64px)] flex items-center justify-center text-zinc-400">
                Loading GSOC workspace...
            </div>
        );
    }

    const scores = data?.critique?.scores || {};
    const avgScore = Object.values(scores).reduce((sum, value) => sum + Number(value || 0), 0) / 5;

    return (
        <div className="h-[calc(100vh-64px)] overflow-hidden rounded-2xl border border-zinc-800 bg-[radial-gradient(circle_at_0%_0%,rgba(16,185,129,0.12),transparent_35%),radial-gradient(circle_at_100%_100%,rgba(14,165,233,0.10),transparent_30%),#09090b]">
            <div className="h-16 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur px-4 md:px-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <Button variant="ghost" size="icon" onClick={() => router.push("/admin/gsoc")}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-400/80">Proposal Lab</p>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="h-8 border-none bg-transparent px-0 text-base font-semibold text-zinc-100 focus-visible:ring-0"
                            placeholder="Proposal title"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExportMarkdown} className="border-zinc-700">
                        <FileDown className="h-4 w-4 mr-2" />
                        Export MD
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving} className="bg-emerald-500 text-black hover:bg-emerald-400">
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                </div>
            </div>

            <div className="h-[calc(100%-64px)] grid grid-cols-12 gap-0">
                <aside className="col-span-12 lg:col-span-2 border-r border-zinc-800/70 bg-zinc-950/30 overflow-y-auto p-3 space-y-2">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 space-y-2">
                        <label className="text-[11px] text-zinc-500 uppercase tracking-wider">Organization</label>
                        <Input
                            value={organization}
                            onChange={(e) => setOrganization(e.target.value)}
                            placeholder="Google / KDE / Apache..."
                            className="h-8 bg-zinc-950/80 border-zinc-700"
                        />
                    </div>

                    {data.sections.map((section) => {
                        const isActive = section.key === selectedSection?.key;
                        const words = section.content?.trim() ? section.content.trim().split(/\s+/).length : 0;
                        return (
                            <button
                                key={section.key}
                                type="button"
                                onClick={() => setSelectedSectionKey(section.key)}
                                className={`w-full text-left rounded-xl border p-3 transition-colors ${
                                    isActive
                                        ? "border-emerald-500/50 bg-emerald-500/10"
                                        : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900"
                                }`}
                            >
                                <p className="text-sm font-medium text-zinc-100">{section.title}</p>
                                <p className="text-[11px] text-zinc-500 mt-1">{words} words</p>
                            </button>
                        );
                    })}
                </aside>

                <section className="col-span-12 lg:col-span-7 border-r border-zinc-800/70 p-4 md:p-6 overflow-y-auto space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
                            <label className="text-[11px] text-zinc-500 uppercase tracking-wider">Tone</label>
                            <select
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="mt-1 h-9 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 text-sm text-zinc-100"
                            >
                                {TONES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
                            <label className="text-[11px] text-zinc-500 uppercase tracking-wider">Project Idea</label>
                            <Input
                                value={projectIdea}
                                onChange={(e) => setProjectIdea(e.target.value)}
                                className="mt-1 h-9 bg-zinc-950 border-zinc-700"
                                placeholder="One-line core idea"
                            />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
                        <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-zinc-100">{selectedSection?.title || "Section"}</h3>
                            <span className="text-[11px] text-zinc-500">
                                {(selectedSection?.content || "").trim().split(/\s+/).filter(Boolean).length} words
                            </span>
                        </div>
                        <Textarea
                            rows={18}
                            value={selectedSection?.content || ""}
                            onChange={(e) => updateSelectedSectionContent(e.target.value)}
                            className="border-0 rounded-none bg-zinc-950/50 text-zinc-100 leading-7 resize-none focus-visible:ring-0"
                            placeholder="Write precise technical details, deliverables, and milestone quality criteria."
                        />
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
                        <label className="text-[11px] text-zinc-500 uppercase tracking-wider">AI Instruction</label>
                        <Textarea
                            rows={3}
                            value={aiInstruction}
                            onChange={(e) => setAiInstruction(e.target.value)}
                            className="mt-1 bg-zinc-950 border-zinc-700"
                            placeholder="Tell AI what to optimize in this section..."
                        />
                    </div>
                </section>

                <aside className="col-span-12 lg:col-span-3 p-4 md:p-5 overflow-y-auto space-y-4">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-2">
                        <h3 className="text-sm font-semibold text-zinc-100">AI Actions</h3>
                        <Button
                            className="w-full justify-start bg-emerald-500 text-black hover:bg-emerald-400"
                            disabled={isGeneratingOutline || isNewProposal}
                            onClick={handleGenerateOutline}
                        >
                            <Sparkles className="h-4 w-4 mr-2" />
                            {isGeneratingOutline ? "Generating Outline..." : "Generate World-Class Outline"}
                        </Button>
                        <Button
                            className="w-full justify-start"
                            variant="outline"
                            disabled={isGeneratingSection || isNewProposal}
                            onClick={handleGenerateSection}
                        >
                            <Wand2 className="h-4 w-4 mr-2" />
                            {isGeneratingSection ? "Improving Section..." : "Enhance Selected Section"}
                        </Button>
                        <Button
                            className="w-full justify-start"
                            variant="outline"
                            disabled={isCritiquing || isNewProposal}
                            onClick={handleCritique}
                        >
                            <ClipboardCheck className="h-4 w-4 mr-2" />
                            {isCritiquing ? "Running Critique..." : "Run Mentor Critique"}
                        </Button>
                        {isNewProposal && (
                            <p className="text-xs text-amber-400 mt-2">Save once to enable AI actions.</p>
                        )}
                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
                        <h3 className="text-sm font-semibold text-zinc-100">Proposal Score</h3>
                        <div className="text-3xl font-bold text-emerald-400">{avgScore.toFixed(1)} / 10</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(scores).map(([key, value]) => (
                                <div key={key} className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1.5">
                                    <p className="text-zinc-500 capitalize">{key}</p>
                                    <p className="text-zinc-100 font-semibold">{Number(value || 0).toFixed(1)}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-zinc-400">{data?.critique?.verdict || "Not evaluated"}</p>
                        {(data?.critique?.recommendations || []).length > 0 && (
                            <div className="space-y-1">
                                {data.critique.recommendations.map((rec, idx) => (
                                    <p key={idx} className="text-xs text-zinc-300 leading-relaxed">• {rec}</p>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                                <History className="h-4 w-4 text-zinc-400" /> Versions
                            </h3>
                            <span className="text-[11px] text-zinc-500">{versions.length}</span>
                        </div>
                        <div className="max-h-56 overflow-y-auto space-y-2">
                            {isLoadingVersions ? (
                                <p className="text-xs text-zinc-500">Loading versions...</p>
                            ) : versions.length === 0 ? (
                                <p className="text-xs text-zinc-500">No versions yet.</p>
                            ) : (
                                versions.map((version) => (
                                    <div key={version.id} className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-2">
                                        <p className="text-[11px] text-zinc-300 truncate">{version.source}</p>
                                        <p className="text-[10px] text-zinc-500">{new Date(version.createdAt).toLocaleString()}</p>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="mt-2 h-7 w-full text-[11px]"
                                            disabled={restoringVersionId === version.id}
                                            onClick={async () => {
                                                setRestoringVersionId(version.id);
                                                try {
                                                    const res = await fetch(`/api/admin/proposals/${proposalId}/restore`, {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({ versionId: version.id })
                                                    });
                                                    const payload = await res.json();
                                                    if (payload?.proposal) {
                                                        hydrateFromProposal(payload.proposal);
                                                        await loadVersions();
                                                    }
                                                } catch (error) {
                                                    console.error("Failed to restore version:", error);
                                                } finally {
                                                    setRestoringVersionId(null);
                                                }
                                            }}
                                        >
                                            <RotateCcw className="h-3 w-3 mr-1" />
                                            Restore
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
