"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Bot,
    ChevronLeft,
    FileDown,
    FileText,
    History,
    RotateCcw,
    Save,
    SendHorizontal,
    Sparkles,
    Wand2,
} from "lucide-react";
import { AI_MODEL_OPTIONS, DEFAULT_MODEL_ID } from "@/lib/ai/models";
import { createDefaultProposalData, GSOC_SECTION_ORDER } from "@/lib/proposals/defaults";

const TONE_OPTIONS = ["academic", "technical", "concise", "confident", "humanized"];

function formatDate(value) {
    if (!value) return "Unknown";
    try {
        return new Date(value).toLocaleString();
    } catch {
        return "Unknown";
    }
}

function wordCount(text = "") {
    return String(text || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
}

function buildMarkdown({ title, organization, projectIdea, sections }) {
    const header = [
        `# ${title || "GSOC Proposal"}`,
        "",
        `- **Organization:** ${organization || "Not specified"}`,
        `- **Project Idea:** ${projectIdea || "Not specified"}`,
        "",
    ].join("\n");

    const body = (sections || [])
        .map((section) => `## ${section.title}\n\n${section.content || "_TODO_"}`)
        .join("\n\n");

    return `${header}${body}\n`;
}

function getAverageScore(scores = {}) {
    const values = [
        Number(scores.clarity || 0),
        Number(scores.feasibility || 0),
        Number(scores.impact || 0),
        Number(scores.originality || 0),
        Number(scores.completeness || 0),
    ];
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export default function GsocEditor({ proposalId }) {
    const router = useRouter();
    const [currentProposalId, setCurrentProposalId] = useState(proposalId);
    const isNewProposal = currentProposalId === "new";

    const [title, setTitle] = useState("GSOC Proposal");
    const [organization, setOrganization] = useState("");
    const [projectIdea, setProjectIdea] = useState("");
    const [tone, setTone] = useState("academic");
    const [data, setData] = useState(() =>
        createDefaultProposalData({
            title: "GSOC Proposal",
            organization: "",
            projectIdea: ""
        })
    );
    const [selectedSectionKey, setSelectedSectionKey] = useState(GSOC_SECTION_ORDER[0]?.key || "");
    const [instruction, setInstruction] = useState("Make this section specific with measurable impact and implementation details.");

    const [writerModelId, setWriterModelId] = useState(DEFAULT_MODEL_ID);
    const [reviewerModelId, setReviewerModelId] = useState("google:gemini-2.5-pro");
    const [humanizerModelId, setHumanizerModelId] = useState("google:gemini-2.5-flash");

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [isCritiquing, setIsCritiquing] = useState(false);
    const [isOptimizingLoop, setIsOptimizingLoop] = useState(false);
    const [loopReview, setLoopReview] = useState(null);

    const [versions, setVersions] = useState([]);
    const [isLoadingVersions, setIsLoadingVersions] = useState(false);
    const [restoringVersionId, setRestoringVersionId] = useState(null);

    const [chatInput, setChatInput] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [isChatting, setIsChatting] = useState(false);
    const [selectedSnippet, setSelectedSnippet] = useState("");
    const [useMcp, setUseMcp] = useState(true);
    const [useExaResearch, setUseExaResearch] = useState(true);
    const [useSequentialThinking, setUseSequentialThinking] = useState(true);
    const [useWebResearchTool, setUseWebResearchTool] = useState(true);
    const [enableGeminiWebSearch, setEnableGeminiWebSearch] = useState(true);
    const [isResearching, setIsResearching] = useState(false);
    const [isAutopilotRunning, setIsAutopilotRunning] = useState(false);
    const [ideaCandidatesInput, setIdeaCandidatesInput] = useState("");
    const [autopilotTargetScore, setAutopilotTargetScore] = useState(9.3);
    const [autopilotMaxIterations, setAutopilotMaxIterations] = useState(4);
    const [activeTab, setActiveTab] = useState("draft");
    const [statusLine, setStatusLine] = useState("");

    const sectionTextareaRef = useRef(null);
    const chatInputRef = useRef(null);

    const sections = data?.sections || [];
    const selectedSection = useMemo(
        () => sections.find((section) => section.key === selectedSectionKey) || null,
        [sections, selectedSectionKey]
    );
    const critiqueScores = data?.critique?.scores || {};
    const proposalScore = getAverageScore(critiqueScores);
    const researchPack = data?.meta?.research || null;
    const mentorQuestions = Array.isArray(data?.meta?.mentorQuestions) ? data.meta.mentorQuestions : [];
    const rankedIdeas = Array.isArray(data?.meta?.rankedIdeas) ? data.meta.rankedIdeas : [];
    const selectedIdea = data?.meta?.selectedIdea || "";
    const lastAssistantMessage = useMemo(() => {
        const reversed = [...chatMessages].reverse();
        return reversed.find((message) => message.role === "assistant");
    }, [chatMessages]);

    const loadVersions = async (targetId = currentProposalId) => {
        if (!targetId || targetId === "new") return;
        setIsLoadingVersions(true);
        try {
            const res = await fetch(`/api/admin/proposals/${targetId}/versions?limit=20`);
            const payload = await res.json();
            if (Array.isArray(payload)) setVersions(payload);
        } catch (error) {
            console.error("Failed to load proposal versions:", error);
        } finally {
            setIsLoadingVersions(false);
        }
    };

    useEffect(() => {
        setCurrentProposalId(proposalId);
    }, [proposalId]);

    useEffect(() => {
        if (isNewProposal) {
            setIsLoading(false);
            const nextData = createDefaultProposalData({
                title: "GSOC Proposal",
                organization: "",
                projectIdea: ""
            });
            setData(nextData);
            setSelectedSectionKey(nextData.sections[0]?.key || "");
            return;
        }

        fetch(`/api/admin/proposals/${currentProposalId}`)
            .then((res) => res.json())
            .then((proposal) => {
                setTitle(proposal?.title || "GSOC Proposal");
                setOrganization(proposal?.organization || "");
                setProjectIdea(proposal?.projectIdea || "");
                setTone(proposal?.tone || "academic");

                const nextData = createDefaultProposalData({
                    title: proposal?.title || "GSOC Proposal",
                    organization: proposal?.organization || "",
                    projectIdea: proposal?.projectIdea || ""
                });
                const mergedData = {
                    ...nextData,
                    ...(proposal?.data || {}),
                    sections: Array.isArray(proposal?.data?.sections) && proposal.data.sections.length > 0
                        ? proposal.data.sections
                        : nextData.sections
                };
                setData(mergedData);
                setSelectedSectionKey(mergedData.sections?.[0]?.key || "");
                setIsLoading(false);
                loadVersions(currentProposalId);
            })
            .catch((error) => {
                console.error("Failed to load proposal:", error);
                setIsLoading(false);
            });
    }, [currentProposalId, isNewProposal]);

    useEffect(() => {
        if (!sections.length) {
            setSelectedSectionKey("");
            return;
        }
        const hasSelected = sections.some((section) => section.key === selectedSectionKey);
        if (!hasSelected) setSelectedSectionKey(sections[0].key);
    }, [sections, selectedSectionKey]);

    useEffect(() => {
        const onKeyDown = (event) => {
            if (!(event.metaKey || event.ctrlKey) || !event.shiftKey || event.key.toLowerCase() !== "l") return;
            event.preventDefault();

            let selectedText = "";
            const textarea = sectionTextareaRef.current;
            if (textarea && typeof textarea.selectionStart === "number" && typeof textarea.selectionEnd === "number") {
                const { selectionStart, selectionEnd, value } = textarea;
                if (selectionEnd > selectionStart) {
                    selectedText = String(value || "").slice(selectionStart, selectionEnd).trim();
                }
            }

            if (!selectedText) {
                selectedText = String(window.getSelection?.()?.toString?.() || "").trim();
            }

            if (!selectedText) {
                setStatusLine("Select text first, then press Cmd/Ctrl+Shift+L.");
                return;
            }

            setSelectedSnippet(selectedText);
            setChatInput((prev) => {
                const seed = `Please improve this selected excerpt:\n"""\n${selectedText}\n"""`;
                return prev?.trim() ? `${seed}\n\n${prev}` : seed;
            });
            setStatusLine("Selected text added to AI chat.");
            requestAnimationFrame(() => {
                chatInputRef.current?.focus?.();
            });
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    const applyProposalPayload = async (payload, shouldReloadVersions = true) => {
        const proposal = payload?.proposal || payload;
        if (!proposal) return;
        setTitle(proposal.title || "GSOC Proposal");
        setOrganization(proposal.organization || "");
        setProjectIdea(proposal.projectIdea || "");
        setTone(proposal.tone || "academic");
        if (proposal.data) setData(proposal.data);
        if (shouldReloadVersions && proposal.id) await loadVersions(proposal.id);
    };

    const saveProposal = async () => {
        setIsSaving(true);
        setStatusLine("");
        try {
            const method = isNewProposal ? "POST" : "PUT";
            const url = isNewProposal ? "/api/admin/proposals" : `/api/admin/proposals/${currentProposalId}`;
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
            if (!res.ok) {
                setStatusLine(payload?.error || "Save failed.");
                return;
            }
            const savedProposal = payload?.proposal || payload;
            if (isNewProposal && savedProposal?.id) {
                setCurrentProposalId(savedProposal.id);
                router.replace(`/admin/gsoc/${savedProposal.id}`);
            }
            await applyProposalPayload(payload);
            setStatusLine("Saved.");
        } catch (error) {
            console.error("Failed to save proposal:", error);
            setStatusLine("Save failed.");
        } finally {
            setIsSaving(false);
        }
    };

    const ensureProposalPersisted = async () => {
        if (!isNewProposal) return currentProposalId;

        try {
            const res = await fetch("/api/admin/proposals", {
                method: "POST",
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
            const created = payload?.proposal || payload;
            if (!res.ok || !created?.id) {
                setStatusLine(payload?.error || "Create draft failed.");
                return null;
            }
            setCurrentProposalId(created.id);
            router.replace(`/admin/gsoc/${created.id}`);
            await applyProposalPayload(payload, false);
            setStatusLine("Draft created. Running AI action...");
            return created.id;
        } catch (error) {
            console.error("Failed to create draft before AI action:", error);
            setStatusLine("Create draft failed.");
            return null;
        }
    };

    const updateSelectedSectionContent = (content) => {
        setData((prev) => ({
            ...prev,
            sections: (prev.sections || []).map((section) =>
                section.key === selectedSectionKey ? { ...section, content } : section
            )
        }));
    };

    const runOutline = async () => {
        setIsGeneratingOutline(true);
        setStatusLine("");
        try {
            const targetProposalId = await ensureProposalPersisted();
            if (!targetProposalId) return;
            const res = await fetch("/api/admin/proposals/outline", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    proposalId: targetProposalId,
                    modelId: writerModelId,
                    enableGeminiWebSearch
                })
            });
            const payload = await res.json();
            if (!res.ok) {
                setStatusLine(payload?.error || "Outline generation failed.");
                return;
            }
            await applyProposalPayload(payload);
            setStatusLine("Outline generated.");
        } catch (error) {
            console.error("Failed to generate outline:", error);
            setStatusLine("Outline generation failed.");
        } finally {
            setIsGeneratingOutline(false);
        }
    };

    const runSectionEnhance = async (customInstruction = "") => {
        if (!selectedSectionKey) return;
        setIsEnhancing(true);
        setStatusLine("");
        try {
            const targetProposalId = await ensureProposalPersisted();
            if (!targetProposalId) return;
            const res = await fetch("/api/admin/proposals/section", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    proposalId: targetProposalId,
                    sectionKey: selectedSectionKey,
                    instruction: customInstruction || instruction,
                    tone,
                    modelId: writerModelId,
                    enableGeminiWebSearch
                })
            });
            const payload = await res.json();
            if (!res.ok) {
                setStatusLine(payload?.error || "Section enhancement failed.");
                return;
            }
            await applyProposalPayload(payload);
            setStatusLine("Section enhanced.");
        } catch (error) {
            console.error("Failed to enhance section:", error);
            setStatusLine("Section enhancement failed.");
        } finally {
            setIsEnhancing(false);
        }
    };

    const runCritique = async () => {
        setIsCritiquing(true);
        setStatusLine("");
        try {
            const targetProposalId = await ensureProposalPersisted();
            if (!targetProposalId) return;
            const res = await fetch("/api/admin/proposals/critique", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    proposalId: targetProposalId,
                    modelId: reviewerModelId,
                    enableGeminiWebSearch
                })
            });
            const payload = await res.json();
            if (!res.ok) {
                setStatusLine(payload?.error || "Critique failed.");
                return;
            }
            await applyProposalPayload(payload);
            setStatusLine("Mentor critique completed.");
        } catch (error) {
            console.error("Failed to run critique:", error);
            setStatusLine("Critique failed.");
        } finally {
            setIsCritiquing(false);
        }
    };

    const runOptimizeLoop = async () => {
        setIsOptimizingLoop(true);
        setStatusLine("");
        try {
            const targetProposalId = await ensureProposalPersisted();
            if (!targetProposalId) return;
            const res = await fetch("/api/admin/proposals/optimize-loop", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    proposalId: targetProposalId,
                    tone,
                    targetScore: 9.2,
                    maxIterations: 4,
                    writerModelId,
                    reviewerModelId,
                    humanizerModelId,
                    enableGeminiWebSearch
                })
            });
            const payload = await res.json();
            if (!res.ok) {
                setStatusLine(payload?.error || "Optimization loop failed.");
                return;
            }
            await applyProposalPayload(payload);
            setLoopReview(payload?.review || null);
            setStatusLine("Multi-agent loop complete.");
        } catch (error) {
            console.error("Failed to run optimize loop:", error);
            setStatusLine("Optimization loop failed.");
        } finally {
            setIsOptimizingLoop(false);
        }
    };

    const getSelectedMcpTools = () => {
        const next = [];
        if (useExaResearch) next.push("exa");
        if (useSequentialThinking) next.push("sequential-thinking");
        if (useWebResearchTool) next.push("web-search");
        return next;
    };

    const runDeepResearch = async () => {
        setIsResearching(true);
        setStatusLine("");
        try {
            const targetProposalId = await ensureProposalPersisted();
            if (!targetProposalId) return;
            const res = await fetch("/api/admin/proposals/research", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    proposalId: targetProposalId,
                    modelId: writerModelId,
                    tone,
                    useMcp,
                    mcpTools: getSelectedMcpTools(),
                    enableGeminiWebSearch,
                    applyToSections: true
                })
            });
            const payload = await res.json();
            if (!res.ok) {
                setStatusLine(payload?.error || "Deep research failed.");
                return;
            }
            await applyProposalPayload(payload);
            setActiveTab("research");
            setStatusLine("Deep research pack generated and applied.");
        } catch (error) {
            console.error("Deep research failed:", error);
            setStatusLine("Deep research failed.");
        } finally {
            setIsResearching(false);
        }
    };

    const runAutopilot = async () => {
        setIsAutopilotRunning(true);
        setStatusLine("");
        try {
            const targetProposalId = await ensureProposalPersisted();
            if (!targetProposalId) return;

            const ideaCandidates = String(ideaCandidatesInput || "")
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean);

            const res = await fetch("/api/admin/proposals/autopilot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    proposalId: targetProposalId,
                    ideaCandidates,
                    tone,
                    writerModelId,
                    reviewerModelId,
                    humanizerModelId,
                    targetScore: Math.max(6, Math.min(9.8, Number(autopilotTargetScore || 9.3))),
                    maxIterations: Math.max(1, Math.min(6, Number(autopilotMaxIterations || 4))),
                    useMcp,
                    mcpTools: getSelectedMcpTools(),
                    enableGeminiWebSearch
                })
            });
            const payload = await res.json();
            if (!res.ok) {
                setStatusLine(payload?.error || "Autopilot failed.");
                return;
            }
            await applyProposalPayload(payload);
            setLoopReview(payload?.review || null);
            if (payload?.selectedIdea) setProjectIdea(payload.selectedIdea);
            setActiveTab("research");
            setStatusLine("Autopilot completed with full research + draft + critique loop.");
        } catch (error) {
            console.error("Autopilot failed:", error);
            setStatusLine("Autopilot failed.");
        } finally {
            setIsAutopilotRunning(false);
        }
    };

    const runInlineChat = async () => {
        if (!chatInput.trim()) return;
        const message = chatInput.trim();
        const nextMessages = [...chatMessages, { role: "user", content: message }];
        setChatMessages(nextMessages);
        setChatInput("");
        setIsChatting(true);
        setStatusLine("");

        try {
            const targetProposalId = await ensureProposalPersisted();
            if (!targetProposalId) return;
            const res = await fetch("/api/admin/proposals/inline-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    proposalId: targetProposalId,
                    sectionKey: selectedSectionKey,
                    tone,
                    modelId: writerModelId,
                    messages: nextMessages,
                    selectionText: selectedSnippet,
                    useMcp,
                    mcpTools: getSelectedMcpTools(),
                    enableGeminiWebSearch
                })
            });
            const payload = await res.json();
            if (!res.ok) {
                setStatusLine(payload?.error || "Inline chat failed.");
                return;
            }
            setChatMessages((prev) => [...prev, { role: "assistant", content: payload?.reply || "No response generated." }]);
        } catch (error) {
            console.error("Inline chat failed:", error);
            setStatusLine("Inline chat failed.");
        } finally {
            setIsChatting(false);
        }
    };

    const exportMarkdown = () => {
        const markdown = buildMarkdown({
            title,
            organization,
            projectIdea,
            sections
        });

        const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${String(title || "gsoc-proposal").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    const exportPdf = () => {
        const markdown = buildMarkdown({
            title,
            organization,
            projectIdea,
            sections
        });

        const html = `
            <html>
            <head>
                <title>${title || "GSOC Proposal"}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.5; color: #111; }
                    h1 { font-size: 24px; margin-bottom: 16px; }
                    h2 { font-size: 18px; margin-top: 28px; margin-bottom: 8px; }
                    p, li { font-size: 12px; }
                    ul { margin-top: 8px; margin-bottom: 8px; }
                    pre { white-space: pre-wrap; word-break: break-word; }
                </style>
            </head>
            <body><pre>${markdown.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></body>
            </html>
        `;

        const popup = window.open("", "_blank");
        if (!popup) return;
        popup.document.write(html);
        popup.document.close();
        popup.focus();
        popup.print();
    };

    if (isLoading) {
        return (
            <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-zinc-950 text-zinc-400">
                Loading proposal...
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-64px)] overflow-hidden rounded-2xl border border-zinc-800 bg-[radial-gradient(circle_at_0%_0%,rgba(16,185,129,0.10),transparent_35%),radial-gradient(circle_at_100%_0%,rgba(14,165,233,0.08),transparent_32%),#09090b]">
            <div className="h-16 border-b border-zinc-800/80 bg-zinc-950/80 px-4 md:px-6 flex items-center justify-between gap-3">
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
                            placeholder="GSOC Proposal title"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" className="border-zinc-700" onClick={exportMarkdown}>
                        <FileText className="h-4 w-4 mr-2" />
                        Export MD
                    </Button>
                    <Button variant="outline" className="border-zinc-700" onClick={exportPdf}>
                        <FileDown className="h-4 w-4 mr-2" />
                        Export PDF
                    </Button>
                    <Button onClick={saveProposal} disabled={isSaving} className="bg-emerald-500 text-black hover:bg-emerald-400">
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                </div>
            </div>

            <div className="h-[calc(100%-64px)] p-4 md:p-5">
                <div className="h-full grid grid-cols-12 gap-4">
                    <aside className="col-span-12 xl:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3 overflow-y-auto">
                        <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-500 mb-3">Sections</p>
                        <div className="space-y-2">
                            {sections.map((section) => {
                                const active = section.key === selectedSectionKey;
                                return (
                                    <button
                                        type="button"
                                        key={section.key}
                                        onClick={() => setSelectedSectionKey(section.key)}
                                        className={`w-full rounded-lg border px-2.5 py-2 text-left transition ${active
                                            ? "border-emerald-500/60 bg-emerald-500/10"
                                            : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700"
                                            }`}
                                    >
                                        <p className={`text-xs font-semibold ${active ? "text-emerald-300" : "text-zinc-200"}`}>
                                            {section.title}
                                        </p>
                                        <p className="text-[10px] text-zinc-500">{wordCount(section.content)} words</p>
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    <section className="col-span-12 xl:col-span-7 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 md:p-5 flex flex-col min-h-0">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <label className="text-[10px] uppercase tracking-wider text-zinc-500">Organization</label>
                                <Input
                                    value={organization}
                                    onChange={(e) => setOrganization(e.target.value)}
                                    placeholder="Google / KDE / Apache"
                                    className="h-9 mt-1 bg-zinc-950 border-zinc-700 text-zinc-100"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-wider text-zinc-500">Tone</label>
                                <select
                                    value={tone}
                                    onChange={(e) => setTone(e.target.value)}
                                    className="h-9 w-full mt-1 rounded-md border border-zinc-700 bg-zinc-950 px-2 text-sm text-zinc-100"
                                >
                                    {TONE_OPTIONS.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-wider text-zinc-500">Project Idea</label>
                                <Input
                                    value={projectIdea}
                                    onChange={(e) => setProjectIdea(e.target.value)}
                                    placeholder="One-line core idea"
                                    className="h-9 mt-1 bg-zinc-950 border-zinc-700 text-zinc-100"
                                />
                            </div>
                        </div>

                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="mt-4 flex-1 min-h-0 flex flex-col"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <TabsList className="h-9 border border-zinc-800 bg-zinc-950 p-1">
                                    <TabsTrigger value="draft" className="h-7 text-xs">Draft</TabsTrigger>
                                    <TabsTrigger value="research" className="h-7 text-xs">Research</TabsTrigger>
                                    <TabsTrigger value="autopilot" className="h-7 text-xs">Autopilot</TabsTrigger>
                                </TabsList>
                                {selectedIdea && (
                                    <p className="truncate text-[11px] text-emerald-300">
                                        Selected idea: {selectedIdea}
                                    </p>
                                )}
                            </div>

                            <TabsContent value="draft" className="mt-3 flex-1 min-h-0 flex flex-col">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-zinc-100">{selectedSection?.title || "Section"}</p>
                                    <span className="text-xs text-zinc-500">{wordCount(selectedSection?.content || "")} words</span>
                                </div>

                                <Textarea
                                    ref={sectionTextareaRef}
                                    value={selectedSection?.content || ""}
                                    onChange={(e) => updateSelectedSectionContent(e.target.value)}
                                    className="mt-2 flex-1 min-h-[320px] resize-none bg-zinc-950 border-zinc-700 text-zinc-100 leading-relaxed"
                                    placeholder="Write precise technical details, deliverables, and quality criteria."
                                />

                                <div className="mt-3">
                                    <label className="text-[10px] uppercase tracking-wider text-zinc-500">AI Instruction</label>
                                    <Textarea
                                        value={instruction}
                                        onChange={(e) => setInstruction(e.target.value)}
                                        rows={3}
                                        className="mt-1 bg-zinc-950 border-zinc-700 text-zinc-100"
                                        placeholder="Make this section concrete with implementation details and measurable impact."
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="research" className="mt-3 flex-1 min-h-0 overflow-y-auto pr-1">
                                {researchPack ? (
                                    <div className="space-y-3">
                                        <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
                                            <p className="text-[11px] uppercase tracking-wider text-zinc-500">Research Summary</p>
                                            <p className="mt-2 text-xs text-zinc-300">
                                                Requirements: {Array.isArray(researchPack?.requirements) ? researchPack.requirements.length : 0}
                                                {" • "}
                                                Risks: {Array.isArray(researchPack?.riskMatrix) ? researchPack.riskMatrix.length : 0}
                                                {" • "}
                                                References: {Array.isArray(researchPack?.references) ? researchPack.references.length : 0}
                                            </p>
                                            {Array.isArray(researchPack?.proposalChecklist) && researchPack.proposalChecklist.length > 0 && (
                                                <div className="mt-2 space-y-1">
                                                    {researchPack.proposalChecklist.slice(0, 6).map((item, index) => (
                                                        <p key={`${item}-${index}`} className="text-xs text-zinc-300">
                                                            {index + 1}. {item}
                                                        </p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {Array.isArray(researchPack?.references) && researchPack.references.length > 0 && (
                                            <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
                                                <p className="text-[11px] uppercase tracking-wider text-zinc-500">References</p>
                                                <div className="mt-2 space-y-2">
                                                    {researchPack.references.slice(0, 10).map((refItem, index) => (
                                                        <div key={`${refItem?.url || "ref"}-${index}`} className="rounded border border-zinc-800 bg-zinc-900/70 p-2">
                                                            <p className="text-xs font-medium text-zinc-200">{refItem?.title || `Reference ${index + 1}`}</p>
                                                            {refItem?.url && (
                                                                <a
                                                                    href={refItem.url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="mt-0.5 block truncate text-[11px] text-cyan-300 hover:text-cyan-200"
                                                                >
                                                                    {refItem.url}
                                                                </a>
                                                            )}
                                                            {refItem?.whyRelevant && (
                                                                <p className="mt-1 text-[11px] text-zinc-400">{refItem.whyRelevant}</p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {mentorQuestions.length > 0 && (
                                            <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
                                                <p className="text-[11px] uppercase tracking-wider text-zinc-500">Mentor Questions</p>
                                                <div className="mt-2 space-y-1">
                                                    {mentorQuestions.slice(0, 8).map((question, index) => (
                                                        <p key={`${question}-${index}`} className="text-xs text-zinc-300">
                                                            {index + 1}. {question}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
                                        <p className="text-sm font-semibold text-zinc-200">No research pack yet</p>
                                        <p className="mt-1 text-xs text-zinc-400">
                                            Run Deep Research or Autopilot to gather org signals, acceptance patterns, timeline guidance, impact metrics, and references.
                                        </p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="autopilot" className="mt-3 flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
                                <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
                                    <p className="text-[11px] uppercase tracking-wider text-zinc-500">Idea Candidates</p>
                                    <Textarea
                                        value={ideaCandidatesInput}
                                        onChange={(e) => setIdeaCandidatesInput(e.target.value)}
                                        rows={6}
                                        className="mt-2 bg-zinc-950 border-zinc-700 text-zinc-100"
                                        placeholder={"Add one idea per line.\nExample:\nBuild distributed tracing dashboard for org X\nImprove CI performance and flaky test intelligence"}
                                    />
                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-wider text-zinc-500">Target Score</label>
                                            <Input
                                                type="number"
                                                min={6}
                                                max={9.8}
                                                step={0.1}
                                                value={autopilotTargetScore}
                                                onChange={(e) => setAutopilotTargetScore(Number(e.target.value || 9.3))}
                                                className="mt-1 h-8 bg-zinc-950 border-zinc-700 text-xs text-zinc-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-wider text-zinc-500">Iterations</label>
                                            <Input
                                                type="number"
                                                min={1}
                                                max={6}
                                                step={1}
                                                value={autopilotMaxIterations}
                                                onChange={(e) => setAutopilotMaxIterations(Number(e.target.value || 4))}
                                                className="mt-1 h-8 bg-zinc-950 border-zinc-700 text-xs text-zinc-100"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        onClick={runAutopilot}
                                        disabled={isAutopilotRunning}
                                        className="mt-3 w-full bg-cyan-500 text-black hover:bg-cyan-400"
                                    >
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        {isAutopilotRunning ? "Running full autopilot..." : "Run Full Agentic Autopilot"}
                                    </Button>
                                </div>

                                {rankedIdeas.length > 0 && (
                                    <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
                                        <p className="text-[11px] uppercase tracking-wider text-zinc-500">Ranked Ideas</p>
                                        <div className="mt-2 space-y-2">
                                            {rankedIdeas.slice(0, 6).map((idea, index) => (
                                                <div key={`${idea?.idea || "idea"}-${index}`} className="rounded border border-zinc-800 bg-zinc-900/70 p-2">
                                                    <p className="text-xs font-semibold text-zinc-200">
                                                        {index + 1}. {idea?.idea || "Untitled idea"}
                                                    </p>
                                                    <p className="mt-0.5 text-[11px] text-zinc-400">
                                                        Final score: {Number(idea?.finalScore || 0).toFixed(1)} / 10
                                                    </p>
                                                    {idea?.reason && (
                                                        <p className="mt-1 text-[11px] text-zinc-400">{idea.reason}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>

                        {statusLine && <p className="mt-2 text-xs text-emerald-300">{statusLine}</p>}
                        <p className="mt-1 text-[11px] text-zinc-500">Shortcut: Cmd/Ctrl+Shift+L adds selected text to chat.</p>
                    </section>

                    <aside className="col-span-12 xl:col-span-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3 flex flex-col gap-3 min-h-0">
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
                            <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">Model Roles</p>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-[10px] text-zinc-400 mb-1">Writer</p>
                                    <select
                                        value={writerModelId}
                                        onChange={(e) => setWriterModelId(e.target.value)}
                                        className="h-8 w-full rounded border border-zinc-700 bg-zinc-950 px-2 text-xs text-zinc-100"
                                    >
                                        {AI_MODEL_OPTIONS.map((model) => (
                                            <option key={model.id} value={model.id}>
                                                {model.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-400 mb-1">Reviewer</p>
                                    <select
                                        value={reviewerModelId}
                                        onChange={(e) => setReviewerModelId(e.target.value)}
                                        className="h-8 w-full rounded border border-zinc-700 bg-zinc-950 px-2 text-xs text-zinc-100"
                                    >
                                        {AI_MODEL_OPTIONS.map((model) => (
                                            <option key={model.id} value={model.id}>
                                                {model.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-400 mb-1">Humanizer</p>
                                    <select
                                        value={humanizerModelId}
                                        onChange={(e) => setHumanizerModelId(e.target.value)}
                                        className="h-8 w-full rounded border border-zinc-700 bg-zinc-950 px-2 text-xs text-zinc-100"
                                    >
                                        {AI_MODEL_OPTIONS.map((model) => (
                                            <option key={model.id} value={model.id}>
                                                {model.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
                            <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">AI Actions</p>
                            <div className="grid grid-cols-1 gap-2">
                                <Button
                                    className="h-9 justify-start bg-cyan-500 text-black hover:bg-cyan-400"
                                    disabled={isAutopilotRunning}
                                    onClick={runAutopilot}
                                >
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    {isAutopilotRunning ? "Autopilot running..." : "Run Full Agentic Autopilot"}
                                </Button>
                                <Button
                                    className="h-9 justify-start bg-emerald-500 text-black hover:bg-emerald-400"
                                    disabled={isResearching}
                                    onClick={runDeepResearch}
                                >
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    {isResearching ? "Researching..." : "Run Deep Research Pack"}
                                </Button>
                                <Button
                                    className="h-9 justify-start bg-teal-500 text-black hover:bg-teal-400"
                                    disabled={isGeneratingOutline}
                                    onClick={runOutline}
                                >
                                    <Wand2 className="h-4 w-4 mr-2" />
                                    {isGeneratingOutline ? "Generating..." : "Generate World-Class Outline"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-9 justify-start border-zinc-700"
                                    disabled={!selectedSectionKey || isEnhancing}
                                    onClick={() => runSectionEnhance("")}
                                >
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    {isEnhancing ? "Enhancing..." : "Enhance Selected Section"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-9 justify-start border-zinc-700"
                                    disabled={isCritiquing}
                                    onClick={runCritique}
                                >
                                    {isCritiquing ? "Running critique..." : "Run Mentor Critique"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-9 justify-start border-zinc-700"
                                    disabled={isOptimizingLoop}
                                    onClick={runOptimizeLoop}
                                >
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    {isOptimizingLoop ? "Loop in progress..." : "Run Multi-AI Loop"}
                                </Button>
                            </div>
                            <div className="mt-3 space-y-1.5 rounded-md border border-zinc-800 bg-zinc-950/70 p-2">
                                <label className="flex items-center gap-2 text-[11px] text-zinc-400">
                                    <input
                                        type="checkbox"
                                        checked={enableGeminiWebSearch}
                                        onChange={(e) => setEnableGeminiWebSearch(e.target.checked)}
                                        className="h-3.5 w-3.5 rounded border-zinc-600 bg-zinc-900"
                                    />
                                    Gemini native web search
                                </label>
                                <label className="flex items-center gap-2 text-[11px] text-zinc-400">
                                    <input
                                        type="checkbox"
                                        checked={useMcp}
                                        onChange={(e) => setUseMcp(e.target.checked)}
                                        className="h-3.5 w-3.5 rounded border-zinc-600 bg-zinc-900"
                                    />
                                    MCP bridge context
                                </label>
                                <label className="flex items-center gap-2 text-[11px] text-zinc-500">
                                    <input
                                        type="checkbox"
                                        checked={useExaResearch}
                                        onChange={(e) => setUseExaResearch(e.target.checked)}
                                        className="h-3.5 w-3.5 rounded border-zinc-600 bg-zinc-900"
                                        disabled={!useMcp}
                                    />
                                    MCP tool: Exa
                                </label>
                                <label className="flex items-center gap-2 text-[11px] text-zinc-500">
                                    <input
                                        type="checkbox"
                                        checked={useSequentialThinking}
                                        onChange={(e) => setUseSequentialThinking(e.target.checked)}
                                        className="h-3.5 w-3.5 rounded border-zinc-600 bg-zinc-900"
                                        disabled={!useMcp}
                                    />
                                    MCP tool: Sequential Thinking
                                </label>
                                <label className="flex items-center gap-2 text-[11px] text-zinc-500">
                                    <input
                                        type="checkbox"
                                        checked={useWebResearchTool}
                                        onChange={(e) => setUseWebResearchTool(e.target.checked)}
                                        className="h-3.5 w-3.5 rounded border-zinc-600 bg-zinc-900"
                                        disabled={!useMcp}
                                    />
                                    MCP tool: Web Search
                                </label>
                            </div>
                        </div>

                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
                            <p className="text-[11px] uppercase tracking-wider text-zinc-500">Proposal Score</p>
                            <p className="mt-1 text-3xl font-bold text-emerald-400">{proposalScore.toFixed(1)} / 10</p>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                                <div className="rounded border border-zinc-800 px-2 py-1">
                                    <p className="text-[10px] text-zinc-500">Clarity</p>
                                    <p className="text-xs text-zinc-200">{Number(critiqueScores.clarity || 0).toFixed(1)}</p>
                                </div>
                                <div className="rounded border border-zinc-800 px-2 py-1">
                                    <p className="text-[10px] text-zinc-500">Feasibility</p>
                                    <p className="text-xs text-zinc-200">{Number(critiqueScores.feasibility || 0).toFixed(1)}</p>
                                </div>
                                <div className="rounded border border-zinc-800 px-2 py-1">
                                    <p className="text-[10px] text-zinc-500">Impact</p>
                                    <p className="text-xs text-zinc-200">{Number(critiqueScores.impact || 0).toFixed(1)}</p>
                                </div>
                                <div className="rounded border border-zinc-800 px-2 py-1">
                                    <p className="text-[10px] text-zinc-500">Originality</p>
                                    <p className="text-xs text-zinc-200">{Number(critiqueScores.originality || 0).toFixed(1)}</p>
                                </div>
                                <div className="rounded border border-zinc-800 px-2 py-1 col-span-2">
                                    <p className="text-[10px] text-zinc-500">Completeness</p>
                                    <p className="text-xs text-zinc-200">{Number(critiqueScores.completeness || 0).toFixed(1)}</p>
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-zinc-400">{data?.critique?.verdict || "Not evaluated"}</p>
                            {loopReview && (
                                <p className="mt-1 text-[11px] text-emerald-300">
                                    Loop {loopReview.score?.toFixed?.(1) || Number(loopReview.score || 0).toFixed(1)} / 10 in {loopReview.iterations} iterations
                                </p>
                            )}
                        </div>

                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
                            <p className="text-[11px] uppercase tracking-wider text-zinc-500">Research Pack</p>
                            {researchPack ? (
                                <div className="mt-2 space-y-2">
                                    <p className="text-[11px] text-zinc-400">
                                        Requirements: {Array.isArray(researchPack?.requirements) ? researchPack.requirements.length : 0} |
                                        Risks: {Array.isArray(researchPack?.riskMatrix) ? researchPack.riskMatrix.length : 0}
                                    </p>
                                    {selectedIdea && (
                                        <p className="text-[11px] text-emerald-300">
                                            Selected idea: {selectedIdea}
                                        </p>
                                    )}
                                    {rankedIdeas.length > 0 && (
                                        <p className="text-[11px] text-zinc-400">
                                            Ranked ideas available: {rankedIdeas.length}
                                        </p>
                                    )}
                                    {Array.isArray(researchPack?.proposalChecklist) && researchPack.proposalChecklist.length > 0 && (
                                        <div className="rounded border border-zinc-800 bg-zinc-900/70 p-2">
                                            <p className="text-[10px] uppercase tracking-wider text-zinc-500">Checklist Top Items</p>
                                            <p className="mt-1 text-[11px] text-zinc-300 leading-relaxed">
                                                {researchPack.proposalChecklist.slice(0, 3).join(" | ")}
                                            </p>
                                        </div>
                                    )}
                                    {mentorQuestions.length > 0 && (
                                        <p className="text-[11px] text-zinc-400">
                                            Mentor questions ready: {mentorQuestions.length}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="mt-1 text-xs text-zinc-500">Run Deep Research Pack to auto-collect requirements, timeline, impact metrics, and risks.</p>
                            )}
                        </div>

                        {!isNewProposal && (
                            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
                                        <History className="h-3.5 w-3.5" />
                                        Versions
                                    </p>
                                    <span className="text-[11px] text-zinc-500">{versions.length}</span>
                                </div>
                                <div className="max-h-28 overflow-y-auto space-y-2">
                                    {isLoadingVersions ? (
                                        <p className="text-xs text-zinc-500">Loading...</p>
                                    ) : versions.length === 0 ? (
                                        <p className="text-xs text-zinc-500">No versions yet.</p>
                                    ) : (
                                        versions.map((version) => (
                                            <div key={version.id} className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1.5 flex items-center justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="text-[11px] text-zinc-300 truncate">{version.source}</p>
                                                    <p className="text-[10px] text-zinc-500">{formatDate(version.createdAt)}</p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-7 px-2 text-[11px] border-zinc-700"
                                                    disabled={restoringVersionId === version.id}
                                                    onClick={async () => {
                                                        setRestoringVersionId(version.id);
                                                        try {
                                                            const res = await fetch(`/api/admin/proposals/${currentProposalId}/restore`, {
                                                                method: "POST",
                                                                headers: { "Content-Type": "application/json" },
                                                                body: JSON.stringify({ versionId: version.id })
                                                            });
                                                            const payload = await res.json();
                                                            if (res.ok && payload?.proposal) {
                                                                await applyProposalPayload(payload);
                                                                setStatusLine("Restored.");
                                                            } else {
                                                                setStatusLine(payload?.error || "Restore failed.");
                                                            }
                                                        } catch (error) {
                                                            console.error("Restore failed:", error);
                                                            setStatusLine("Restore failed.");
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
                        )}

                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 flex flex-col min-h-[240px]">
                            <p className="text-xs font-semibold text-zinc-300 mb-2 flex items-center gap-2">
                                <Bot className="h-3.5 w-3.5" />
                                Inline AI Copilot
                            </p>
                            <label className="mb-2 flex items-center gap-2 text-[11px] text-zinc-400">
                                <input
                                    type="checkbox"
                                    checked={useMcp}
                                    onChange={(e) => setUseMcp(e.target.checked)}
                                    className="h-3.5 w-3.5 rounded border-zinc-600 bg-zinc-900"
                                />
                                Use MCP context
                            </label>
                            {selectedSnippet && (
                                <div className="mb-2 rounded-md border border-zinc-800 bg-zinc-900/70 p-2">
                                    <p className="text-[10px] uppercase tracking-wider text-zinc-500">Selected Excerpt</p>
                                    <p className="mt-1 text-[11px] text-zinc-300 line-clamp-3">{selectedSnippet}</p>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="mt-1 h-6 px-1 text-[10px] text-zinc-400 hover:text-zinc-200"
                                        onClick={() => setSelectedSnippet("")}
                                    >
                                        Clear
                                    </Button>
                                </div>
                            )}
                            <div className="h-32 overflow-y-auto space-y-2 rounded-md border border-zinc-800 bg-zinc-950 p-2">
                                {chatMessages.length === 0 ? (
                                    <p className="text-[11px] text-zinc-500">Ask AI to sharpen your section, improve outcomes, or suggest stronger implementation details.</p>
                                ) : (
                                    chatMessages.map((message, index) => (
                                        <div key={`${message.role}-${index}`} className={`text-xs ${message.role === "assistant" ? "text-emerald-200" : "text-zinc-300"}`}>
                                            <p className="font-semibold mb-0.5">{message.role === "assistant" ? "AI" : "You"}</p>
                                            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="mt-2 flex gap-2">
                                <Textarea
                                    ref={chatInputRef}
                                    rows={2}
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" && !event.shiftKey) {
                                            event.preventDefault();
                                            if (!isChatting) runInlineChat();
                                        }
                                    }}
                                    placeholder="Ask AI to improve this section..."
                                    className="min-h-[52px] bg-zinc-950 border-zinc-700 text-xs"
                                />
                                <Button className="h-9" disabled={isChatting} onClick={runInlineChat}>
                                    <SendHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                            {lastAssistantMessage && (
                                <Button
                                    variant="outline"
                                    className="mt-2 h-8 text-[11px] border-zinc-700"
                                    disabled={isEnhancing}
                                    onClick={() => runSectionEnhance(lastAssistantMessage.content)}
                                >
                                    Apply Last AI Suggestion
                                </Button>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
