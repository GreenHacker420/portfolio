"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Bot,
    ChevronLeft,
    FileDown,
    History,
    RotateCcw,
    Save,
    SendHorizontal,
    Sparkles,
} from "lucide-react";
import { AI_MODEL_OPTIONS, DEFAULT_MODEL_ID } from "@/lib/ai/models";

const TONE_OPTIONS = ["formal", "concise", "confident", "technical", "humanized"];

function formatDate(value) {
    if (!value) return "Unknown";
    try {
        return new Date(value).toLocaleString();
    } catch {
        return "Unknown";
    }
}

function sanitizeLatexInput(value = "") {
    const raw = String(value || "");
    const withoutFenceStart = raw.replace(/^\s*```(?:latex|tex)?\s*/i, "");
    const withoutFenceEnd = withoutFenceStart.replace(/\s*```\s*$/i, "");
    return withoutFenceEnd.trim();
}

export default function ResumeEditor({ resumeId }) {
    const router = useRouter();
    const [currentResumeId, setCurrentResumeId] = useState(resumeId);
    const isNewResume = currentResumeId === "new";

    const [title, setTitle] = useState("Untitled Resume");
    const [code, setCode] = useState("% Enter your LaTeX code here...\n\\documentclass{article}\n\\begin{document}\nHello World\n\\end{document}");
    const [structured, setStructured] = useState(null);
    const [jdText, setJdText] = useState("");
    const [tone, setTone] = useState("concise");
    const [selectedSectionKey, setSelectedSectionKey] = useState("");
    const [sectionInstruction, setSectionInstruction] = useState("Improve this section for role fit, measurable impact, and ATS keywords.");

    const [writerModelId, setWriterModelId] = useState(DEFAULT_MODEL_ID);
    const [reviewerModelId, setReviewerModelId] = useState("google:gemini-2.5-pro");
    const [humanizerModelId, setHumanizerModelId] = useState("google:gemini-2.5-flash");

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isRewriting, setIsRewriting] = useState(false);
    const [isSectionRewriting, setIsSectionRewriting] = useState(false);
    const [isOptimizingLoop, setIsOptimizingLoop] = useState(false);
    const [isGithubSyncing, setIsGithubSyncing] = useState(false);
    const [loopReview, setLoopReview] = useState(null);
    const [statusLine, setStatusLine] = useState("");

    const [versions, setVersions] = useState([]);
    const [isLoadingVersions, setIsLoadingVersions] = useState(false);
    const [restoringVersionId, setRestoringVersionId] = useState(null);

    const [chatInput, setChatInput] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [isChatting, setIsChatting] = useState(false);
    const [selectedSnippet, setSelectedSnippet] = useState("");
    const [useMcp, setUseMcp] = useState(true);

    const monacoEditorRef = useRef(null);
    const chatInputRef = useRef(null);

    const sections = structured?.sections || {};
    const sectionEntries = useMemo(() => Object.entries(sections), [sections]);
    const selectedSection = selectedSectionKey ? sections[selectedSectionKey] : null;
    const lastAssistantMessage = useMemo(() => {
        const reversed = [...chatMessages].reverse();
        return reversed.find((msg) => msg.role === "assistant");
    }, [chatMessages]);

    const previewHtml = useMemo(() => `
        <html>
        <head>
            <script src="https://cdn.jsdelivr.net/npm/latex.js/dist/latex.js"><\/script>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/latex.js/dist/latex.js/css/katex.css">
            <style>
                body { padding: 24px; font-family: "Times New Roman", serif; }
                #latex-output { max-width: 100%; }
            </style>
        </head>
        <body>
            <div id="latex-output"></div>
            <script>
                try {
                    const latex = ${JSON.stringify(code)};
                    const generator = new latexjs.HtmlGenerator({ hyphenate: false });
                    const doc = latexjs.parse(latex, { generator: generator });
                    document.head.appendChild(generator.stylesAndScripts("https://cdn.jsdelivr.net/npm/latex.js/dist/"));
                    document.body.appendChild(doc.domFragment());
                } catch (e) {
                    document.body.innerHTML = "<pre style='color:red'>" + e.message + "</pre>";
                }
            <\/script>
        </body>
        </html>
    `, [code]);

    useEffect(() => {
        setCurrentResumeId(resumeId);
    }, [resumeId]);

    const loadVersions = async (targetResumeId = currentResumeId) => {
        if (!targetResumeId || targetResumeId === "new") return;
        setIsLoadingVersions(true);
        try {
            const res = await fetch(`/api/admin/resumes/${targetResumeId}/versions?limit=20`);
            const payload = await res.json();
            if (Array.isArray(payload)) setVersions(payload);
        } catch (error) {
            console.error("Failed to load versions:", error);
        } finally {
            setIsLoadingVersions(false);
        }
    };

    useEffect(() => {
        if (isNewResume) {
            setIsLoading(false);
            return;
        }

        fetch(`/api/admin/resumes/${currentResumeId}`)
            .then((res) => res.json())
            .then((resume) => {
                setTitle(resume.title || "Untitled Resume");
                setCode(sanitizeLatexInput(resume.latex || ""));
                setStructured(resume.structured || null);
                setIsLoading(false);
                loadVersions(currentResumeId);
            })
            .catch((error) => {
                console.error("Failed to load resume:", error);
                setIsLoading(false);
            });
    }, [currentResumeId, isNewResume]);

    useEffect(() => {
        if (sectionEntries.length === 0) {
            setSelectedSectionKey("");
            return;
        }
        const hasSelected = sectionEntries.some(([key]) => key === selectedSectionKey);
        if (!hasSelected) setSelectedSectionKey(sectionEntries[0][0]);
    }, [sectionEntries, selectedSectionKey]);

    useEffect(() => {
        const onKeyDown = (event) => {
            if (!(event.metaKey || event.ctrlKey) || !event.shiftKey || event.key.toLowerCase() !== "l") return;
            event.preventDefault();

            let selectedText = "";
            const editor = monacoEditorRef.current;
            if (editor) {
                const model = editor.getModel?.();
                const selection = editor.getSelection?.();
                if (model && selection && !selection.isEmpty?.()) {
                    selectedText = model.getValueInRange(selection).trim();
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

    const ensureResumePersisted = async () => {
        if (!isNewResume) return currentResumeId;

        try {
            const res = await fetch("/api/admin/resumes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, latex: sanitizeLatexInput(code), structured, source: "manual" })
            });
            const payload = await res.json();
            if (!res.ok || !payload?.id) {
                setStatusLine(payload?.error || "Please save once before AI actions.");
                return null;
            }

            setCurrentResumeId(payload.id);
            router.replace(`/admin/resumes/${payload.id}`);
            setStatusLine("Draft created. Running AI action...");
            return payload.id;
        } catch (error) {
            console.error("Draft create failed:", error);
            setStatusLine("Please save once before AI actions.");
            return null;
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setStatusLine("");
        try {
            const method = isNewResume ? "POST" : "PUT";
            const url = isNewResume ? "/api/admin/resumes" : `/api/admin/resumes/${currentResumeId}`;
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, latex: sanitizeLatexInput(code), structured, source: "manual" })
            });
            const payload = await res.json();

            if (!res.ok) {
                setStatusLine(payload?.error || "Save failed.");
                return;
            }

            if (isNewResume && payload?.id) {
                setCurrentResumeId(payload.id);
                router.replace(`/admin/resumes/${payload.id}`);
                return;
            }
            await loadVersions(currentResumeId);
            setStatusLine("Saved.");
        } catch (error) {
            console.error("Save failed:", error);
            setStatusLine("Save failed.");
        } finally {
            setIsSaving(false);
        }
    };

    const runFullRewrite = async () => {
        if (!jdText) return;
        setIsRewriting(true);
        setStatusLine("");
        try {
            const targetResumeId = await ensureResumePersisted();
            if (!targetResumeId) return;

            const res = await fetch("/api/admin/resumes/rewrite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resumeId: targetResumeId,
                    jdText,
                    modelId: writerModelId
                })
            });
            const payload = await res.json();
            if (!res.ok) {
                setStatusLine(payload?.error || "Full rewrite failed.");
                return;
            }
            if (payload?.latex) {
                setCode(sanitizeLatexInput(payload.latex));
                if (payload.structured) setStructured(payload.structured);
                await loadVersions(targetResumeId);
            }
            setStatusLine("Full rewrite completed.");
        } catch (error) {
            console.error("Full rewrite failed:", error);
            setStatusLine("Full rewrite failed.");
        } finally {
            setIsRewriting(false);
        }
    };

    const runSectionRewrite = async (instruction = "") => {
        if (!jdText || !selectedSectionKey) return;
        setIsSectionRewriting(true);
        setStatusLine("");
        try {
            const targetResumeId = await ensureResumePersisted();
            if (!targetResumeId) return;

            const res = await fetch("/api/admin/resumes/rewrite-section", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resumeId: targetResumeId,
                    jdText,
                    sectionKey: selectedSectionKey,
                    tone,
                    instruction: instruction || sectionInstruction,
                    modelId: writerModelId
                })
            });
            const payload = await res.json();
            if (!res.ok) {
                setStatusLine(payload?.error || "Section rewrite failed.");
                return;
            }
            if (payload?.latex) {
                setCode(sanitizeLatexInput(payload.latex));
                if (payload.structured) setStructured(payload.structured);
                await loadVersions(targetResumeId);
            }
            setStatusLine("Section rewrite completed.");
        } catch (error) {
            console.error("Section rewrite failed:", error);
            setStatusLine("Section rewrite failed.");
        } finally {
            setIsSectionRewriting(false);
        }
    };

    const runOptimizeLoop = async () => {
        if (!jdText) return;
        setIsOptimizingLoop(true);
        setStatusLine("");
        try {
            const targetResumeId = await ensureResumePersisted();
            if (!targetResumeId) return;

            const res = await fetch("/api/admin/resumes/optimize-loop", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resumeId: targetResumeId,
                    jdText,
                    tone,
                    writerModelId,
                    reviewerModelId,
                    humanizerModelId,
                    maxIterations: 4,
                    targetScore: 9.0
                })
            });
            const payload = await res.json();
            if (!res.ok) {
                setStatusLine(payload?.error || "Multi-agent loop failed.");
                return;
            }
            if (payload?.latex) {
                setCode(sanitizeLatexInput(payload.latex));
                if (payload.structured) setStructured(payload.structured);
                setLoopReview(payload.review || null);
                await loadVersions(targetResumeId);
            }
            setStatusLine("Multi-agent loop completed.");
        } catch (error) {
            console.error("Loop optimization failed:", error);
            setStatusLine("Multi-agent loop failed.");
        } finally {
            setIsOptimizingLoop(false);
        }
    };

    const handleGithubSync = async () => {
        setIsGithubSyncing(true);
        setStatusLine("");
        try {
            const res = await fetch("/api/admin/resumes/github-sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            });
            const payload = await res.json();
            if (!res.ok) {
                setStatusLine(payload?.error || "GitHub sync failed.");
                return;
            }
            setStatusLine("GitHub evidence synced.");
        } catch (error) {
            console.error("GitHub sync failed:", error);
            setStatusLine("GitHub sync failed.");
        } finally {
            setIsGithubSyncing(false);
        }
    };

    const sendInlineChat = async () => {
        const message = chatInput.trim();
        if (!message) return;

        const nextMessages = [...chatMessages, { role: "user", content: message }];
        setChatMessages(nextMessages);
        setChatInput("");
        setIsChatting(true);
        setStatusLine("");

        try {
            const targetResumeId = await ensureResumePersisted();
            if (!targetResumeId) return;

            const res = await fetch("/api/admin/resumes/inline-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resumeId: targetResumeId,
                    jdText,
                    sectionKey: selectedSectionKey,
                    tone,
                    modelId: writerModelId,
                    messages: nextMessages,
                    selectionText: selectedSnippet,
                    useMcp
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

    if (isLoading) {
        return (
            <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-zinc-950 text-zinc-400">
                Loading resume...
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-64px)] overflow-hidden rounded-2xl border border-zinc-800 bg-[radial-gradient(circle_at_0%_0%,rgba(16,185,129,0.10),transparent_35%),radial-gradient(circle_at_100%_0%,rgba(14,165,233,0.12),transparent_32%),#09090b]">
            <div className="h-16 border-b border-zinc-800/80 bg-zinc-950/80 px-4 md:px-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <Button variant="ghost" size="icon" onClick={() => router.push("/admin/resumes")}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-400/80">Resume Intelligence</p>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="h-8 border-none bg-transparent px-0 text-base font-semibold text-zinc-100 focus-visible:ring-0"
                            placeholder="Resume title"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {!isNewResume && (
                        <a href={`/api/resumes/${currentResumeId}/pdf`} target="_blank" rel="noreferrer">
                            <Button variant="outline" className="border-zinc-700">
                                <FileDown className="h-4 w-4 mr-2" />
                                PDF
                            </Button>
                        </a>
                    )}
                    <Button onClick={handleSave} disabled={isSaving} className="bg-emerald-500 hover:bg-emerald-400 text-black">
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                </div>
            </div>

            <div className="h-[calc(100%-64px)] p-4 md:p-5">
                <div className="h-full grid grid-cols-12 gap-4 min-h-0">
                    <section className="col-span-12 xl:col-span-5 rounded-2xl border border-zinc-800 bg-zinc-900/45 overflow-hidden min-h-0">
                        <div className="h-10 px-4 border-b border-zinc-800 flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">LaTeX Source</p>
                            <p className="text-[11px] text-zinc-500">Monaco Editor</p>
                        </div>
                        <Editor
                            height="calc(100% - 40px)"
                            defaultLanguage="latex"
                            theme="vs-dark"
                            value={code}
                            onChange={(value) => setCode(value || "")}
                            onMount={(editor) => {
                                monacoEditorRef.current = editor;
                            }}
                            options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: "on" }}
                        />
                    </section>

                    <section className="col-span-12 xl:col-span-5 rounded-2xl border border-zinc-800 bg-zinc-900/45 overflow-hidden min-h-0">
                        <div className="h-10 px-4 border-b border-zinc-800 flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Live Preview</p>
                            <p className="text-[11px] text-zinc-500">{selectedSection?.title || "Full Resume"}</p>
                        </div>
                        <div className="h-[calc(100%-40px)] bg-white">
                            <iframe srcDoc={previewHtml} className="w-full h-full border-none" />
                        </div>
                    </section>

                    <aside className="col-span-12 xl:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/45 p-3 flex flex-col gap-3 overflow-y-auto">
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
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">Job Description</label>
                            <Textarea
                                rows={4}
                                value={jdText}
                                onChange={(e) => setJdText(e.target.value)}
                                placeholder="Paste target JD for keyword and impact alignment."
                                className="bg-zinc-950 border-zinc-700 text-zinc-100"
                            />
                            <div className="mt-2 grid grid-cols-1 gap-2">
                                <select
                                    value={selectedSectionKey}
                                    onChange={(e) => setSelectedSectionKey(e.target.value)}
                                    className="h-8 rounded-md border border-zinc-700 bg-zinc-950 px-2 text-xs text-zinc-200"
                                >
                                    {sectionEntries.length === 0 ? (
                                        <option value="">No sections</option>
                                    ) : (
                                        sectionEntries.map(([key, section]) => (
                                            <option key={key} value={key}>
                                                {section?.title || key}
                                            </option>
                                        ))
                                    )}
                                </select>
                                <select
                                    value={tone}
                                    onChange={(e) => setTone(e.target.value)}
                                    className="h-8 rounded-md border border-zinc-700 bg-zinc-950 px-2 text-xs text-zinc-200"
                                >
                                    {TONE_OPTIONS.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                <Textarea
                                    rows={3}
                                    value={sectionInstruction}
                                    onChange={(e) => setSectionInstruction(e.target.value)}
                                    placeholder="Section-level rewrite instruction..."
                                    className="bg-zinc-950 border-zinc-700 text-zinc-100 text-xs"
                                />
                                <Button
                                    variant="outline"
                                    className="h-8 text-xs border-zinc-700"
                                    disabled={!jdText || isRewriting}
                                    onClick={runFullRewrite}
                                >
                                    {isRewriting ? "Rewriting..." : "Rewrite Full Resume"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-8 text-xs border-zinc-700"
                                    disabled={!jdText || !selectedSectionKey || isSectionRewriting}
                                    onClick={() => runSectionRewrite("")}
                                >
                                    {isSectionRewriting ? "Rewriting..." : "Rewrite Selected Section"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-8 text-xs border-zinc-700"
                                    disabled={isGithubSyncing}
                                    onClick={handleGithubSync}
                                >
                                    {isGithubSyncing ? "Syncing..." : "Sync GitHub Evidence"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-8 text-xs border-zinc-700"
                                    disabled={!jdText || isOptimizingLoop}
                                    onClick={runOptimizeLoop}
                                >
                                    <Sparkles className="h-3.5 w-3.5 mr-1" />
                                    {isOptimizingLoop ? "Loop running..." : "Run Multi-AI Loop"}
                                </Button>
                            </div>
                            {isNewResume && (
                                <p className="mt-2 text-[11px] text-zinc-500">First AI action auto-saves this draft.</p>
                            )}
                            {loopReview && (
                                <p className="mt-2 text-[11px] text-emerald-300">
                                    Loop score {Number(loopReview.score || 0).toFixed(1)} / 10 in {Number(loopReview.iterations || 0)} iterations
                                </p>
                            )}
                            {statusLine && <p className="mt-1 text-[11px] text-zinc-400">{statusLine}</p>}
                            <p className="mt-1 text-[11px] text-zinc-500">Shortcut: Cmd/Ctrl+Shift+L adds selected text to chat.</p>
                        </div>

                        {!isNewResume && (
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
                                                            const res = await fetch(`/api/admin/resumes/${currentResumeId}/restore`, {
                                                                method: "POST",
                                                                headers: { "Content-Type": "application/json" },
                                                                body: JSON.stringify({ versionId: version.id })
                                                            });
                                                            const payload = await res.json();
                                                            if (res.ok && payload?.resume) {
                                                                setTitle(payload.resume.title);
                                                                setCode(sanitizeLatexInput(payload.resume.latex));
                                                                setStructured(payload.resume.structured || null);
                                                                await loadVersions(currentResumeId);
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

                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 flex flex-col min-h-[220px]">
                            {isNewResume && (
                                <p className="mb-2 text-[11px] text-zinc-500">Send message to start AI. Draft is auto-saved.</p>
                            )}
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
                            <div className="h-28 overflow-y-auto space-y-2 rounded-md border border-zinc-800 bg-zinc-950 p-2">
                                {chatMessages.length === 0 ? (
                                    <p className="text-[11px] text-zinc-500">Ask AI to rewrite bullets, humanize tone, or improve selected section.</p>
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
                                            if (!isChatting) sendInlineChat();
                                        }
                                    }}
                                    placeholder="Ask AI to improve selected section..."
                                    className="min-h-[52px] bg-zinc-950 border-zinc-700 text-xs"
                                />
                                <Button className="h-9" disabled={isChatting} onClick={sendInlineChat}>
                                    <SendHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                            {lastAssistantMessage && selectedSection && (
                                <Button
                                    variant="outline"
                                    className="mt-2 h-8 text-[11px] border-zinc-700"
                                    disabled={isSectionRewriting}
                                    onClick={() => runSectionRewrite(lastAssistantMessage.content)}
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
