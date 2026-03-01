"use client";

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, ChevronLeft, History, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';

export default function ResumeEditor({ resumeId }) {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [code, setCode] = useState('');
    const [structured, setStructured] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [jdText, setJdText] = useState('');
    const [isRewriting, setIsRewriting] = useState(false);
    const [isSectionRewriting, setIsSectionRewriting] = useState(false);
    const [versions, setVersions] = useState([]);
    const [isLoadingVersions, setIsLoadingVersions] = useState(false);
    const [restoringVersionId, setRestoringVersionId] = useState(null);
    const [selectedSectionKey, setSelectedSectionKey] = useState("");
    const [tone, setTone] = useState("concise");
    const [isGithubSyncing, setIsGithubSyncing] = useState(false);

    const isNewResume = resumeId === 'new';
    const sectionEntries = Object.entries(structured?.sections || {});

    const loadVersions = async () => {
        if (isNewResume) return;
        setIsLoadingVersions(true);
        try {
            const res = await fetch(`/api/admin/resumes/${resumeId}/versions?limit=15`);
            const data = await res.json();
            if (Array.isArray(data)) setVersions(data);
        } catch (error) {
            console.error("Failed to load versions:", error);
        } finally {
            setIsLoadingVersions(false);
        }
    };

    useEffect(() => {
        if (isNewResume) {
            setIsLoading(false);
            setCode("% Enter your LaTeX code here...\n\\documentclass{article}\n\\begin{document}\nHello World\n\\end{document}");
            return;
        }

        fetch(`/api/admin/resumes/${resumeId}`)
            .then(res => res.json())
            .then(data => {
                setTitle(data.title);
                setCode(data.latex);
                setStructured(data.structured || null);
                setIsLoading(false);
                loadVersions();
            })
            .catch(err => console.error(err));
    }, [resumeId, isNewResume]);

    useEffect(() => {
        const entries = Object.entries(structured?.sections || {});
        if (entries.length === 0) {
            setSelectedSectionKey("");
            return;
        }
        const hasSelection = entries.some(([key]) => key === selectedSectionKey);
        if (!hasSelection) {
            setSelectedSectionKey(entries[0][0]);
        }
    }, [structured, selectedSectionKey]);

    const handleSectionRewrite = async () => {
        if (!jdText || !selectedSectionKey || isNewResume) return;
        setIsSectionRewriting(true);
        try {
            const res = await fetch('/api/admin/resumes/rewrite-section', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeId,
                    jdText,
                    sectionKey: selectedSectionKey,
                    tone
                })
            });
            const data = await res.json();
            if (data.latex) {
                setCode(data.latex);
                if (data.structured) setStructured(data.structured);
                await loadVersions();
            }
        } catch (error) {
            console.error("Section rewrite failed:", error);
        } finally {
            setIsSectionRewriting(false);
        }
    };

    const handleGithubSync = async () => {
        setIsGithubSyncing(true);
        try {
            await fetch('/api/admin/resumes/github-sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
        } catch (error) {
            console.error("GitHub sync failed:", error);
        } finally {
            setIsGithubSyncing(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        const method = isNewResume ? 'POST' : 'PUT';
        const url = isNewResume ? '/api/admin/resumes' : `/api/admin/resumes/${resumeId}`;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, latex: code, structured, source: "manual" })
            });
            const data = await res.json();
            if (isNewResume && data.id) {
                router.push(`/admin/resumes/${data.id}`);
                return;
            }
            await loadVersions();
        } catch (error) {
            console.error("Save failed:", error);
        } finally {
            setIsSaving(false);
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
        <div className="h-[calc(100vh-64px)] flex flex-col bg-zinc-950">
            {/* Toolbar */}
            <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/50">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/admin/resumes')}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Resume Title"
                        className="bg-transparent border-none text-lg font-bold w-64 focus-visible:ring-0"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleSave} disabled={isSaving} className="bg-emerald-500 hover:bg-emerald-600 text-black">
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={async () => {
                            if (!jdText) return;
                            setIsRewriting(true);
                            try {
                                const res = await fetch('/api/admin/resumes/rewrite', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ resumeId, jdText })
                                });
                                const data = await res.json();
                                if (data.latex) {
                                    setCode(data.latex);
                                    if (data.structured) setStructured(data.structured);
                                    await loadVersions();
                                }
                            } finally {
                                setIsRewriting(false);
                            }
                        }}
                        disabled={isRewriting}
                    >
                        {isRewriting ? "Rewriting..." : "Rewrite for JD"}
                    </Button>
                </div>
            </div>

            {/* Editor & Preview Split */}
            <div className="flex-1 flex overflow-hidden">
                {/* Editor */}
                <div className="w-1/2 border-r border-zinc-800">
                    <Editor
                        height="100%"
                        defaultLanguage="latex"
                        theme="vs-dark"
                        value={code}
                        onChange={(value) => setCode(value)}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            wordWrap: 'on'
                        }}
                    />
                </div>

                {/* Preview (Placeholder for now) */}
                <div className="w-1/2 bg-white flex flex-col">
                    <div className="p-4 border-b border-zinc-200">
                        <label className="block text-xs font-semibold text-zinc-600 mb-1">Job Description (paste)</label>
                        <Textarea
                            rows={6}
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                            placeholder="Paste JD to tailor this resume"
                        />
                        {!isNewResume && (
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-2">
                                <select
                                    className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-xs text-zinc-800"
                                    value={selectedSectionKey}
                                    onChange={(e) => setSelectedSectionKey(e.target.value)}
                                >
                                    {sectionEntries.length === 0 ? (
                                        <option value="">No sections found</option>
                                    ) : (
                                        sectionEntries.map(([key, value]) => (
                                            <option key={key} value={key}>
                                                {value?.title || key}
                                            </option>
                                        ))
                                    )}
                                </select>
                                <select
                                    className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-xs text-zinc-800"
                                    value={tone}
                                    onChange={(e) => setTone(e.target.value)}
                                >
                                    <option value="formal">Formal</option>
                                    <option value="concise">Concise</option>
                                    <option value="confident">Confident</option>
                                    <option value="technical">Technical</option>
                                    <option value="humanized">Humanized</option>
                                </select>
                                <Button
                                    variant="outline"
                                    className="h-9 text-xs"
                                    disabled={!jdText || !selectedSectionKey || isSectionRewriting}
                                    onClick={handleSectionRewrite}
                                >
                                    {isSectionRewriting ? "Rewriting Section..." : "Rewrite Section"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-9 text-xs"
                                    disabled={isGithubSyncing}
                                    onClick={handleGithubSync}
                                >
                                    {isGithubSyncing ? "Syncing GitHub..." : "Sync GitHub Evidence"}
                                </Button>
                            </div>
                        )}
                    </div>

                    {!isNewResume && (
                        <div className="border-b border-zinc-200 p-3 bg-zinc-50">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                                    <History className="h-3.5 w-3.5" />
                                    Version History
                                </div>
                                <span className="text-[11px] text-zinc-500">{versions.length} entries</span>
                            </div>
                            <div className="max-h-32 overflow-y-auto space-y-1">
                                {isLoadingVersions ? (
                                    <p className="text-xs text-zinc-500">Loading history...</p>
                                ) : versions.length === 0 ? (
                                    <p className="text-xs text-zinc-500">No versions yet.</p>
                                ) : (
                                    versions.map((version) => (
                                        <div key={version.id} className="flex items-center justify-between gap-2 rounded border border-zinc-200 px-2 py-1 bg-white">
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-medium text-zinc-700 truncate">
                                                    {version.source || "manual"}
                                                </p>
                                                <p className="text-[10px] text-zinc-500">
                                                    {new Date(version.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-7 px-2 text-[11px]"
                                                disabled={restoringVersionId === version.id}
                                                onClick={async () => {
                                                    setRestoringVersionId(version.id);
                                                    try {
                                                        const res = await fetch(`/api/admin/resumes/${resumeId}/restore`, {
                                                            method: "POST",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({ versionId: version.id })
                                                        });
                                                        const data = await res.json();
                                                        if (data?.resume) {
                                                            setTitle(data.resume.title);
                                                            setCode(data.resume.latex);
                                                            setStructured(data.resume.structured || null);
                                                            await loadVersions();
                                                        }
                                                    } catch (error) {
                                                        console.error("Restore failed:", error);
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

                    <iframe
                        srcDoc={`
                            <html>
                            <head>
                                <script src="https://cdn.jsdelivr.net/npm/latex.js/dist/latex.js"></script>
                                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/latex.js/dist/latex.js/css/katex.css">
                                <style>body { padding: 20px; }</style>
                            </head>
                            <body>
                                <div id="latex-output"></div>
                                <script>
                                    const generator = new latexjs.HtmlGenerator({ hyphenate: false });
                                    try {
                                        const latex = ${JSON.stringify(code)}; // Simple injection
                                        const generator = new latexjs.HtmlGenerator({ hyphenate: false });
                                        const doc = latexjs.parse(latex, { generator: generator });
                                        document.head.appendChild(generator.stylesAndScripts("https://cdn.jsdelivr.net/npm/latex.js/dist/"));
                                        document.body.appendChild(doc.domFragment());
                                    } catch (e) {
                                        document.body.innerHTML = "<pre style='color:red'>" + e.message + "</pre>";
                                    }
                                </script>
                            </body>
                            </html>
                        `}
                        className="w-full h-full border-none"
                    />
                </div>
            </div>
        </div>
    );
}
