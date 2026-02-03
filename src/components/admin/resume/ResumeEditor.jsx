"use client";

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Eye, FileText, ChevronLeft, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ResumeEditor({ resumeId }) {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (resumeId === 'new') {
            setIsLoading(false);
            setCode("% Enter your LaTeX code here...\n\\documentclass{article}\n\\begin{document}\nHello World\n\\end{document}");
            return;
        }

        fetch(`/api/admin/resumes/${resumeId}`)
            .then(res => res.json())
            .then(data => {
                setTitle(data.title);
                setCode(data.latex);
                setIsLoading(false);
            })
            .catch(err => console.error(err));
    }, [resumeId]);

    const handleSave = async () => {
        setIsSaving(true);
        const method = resumeId === 'new' ? 'POST' : 'PUT';
        const url = resumeId === 'new' ? '/api/admin/resumes' : `/api/admin/resumes/${resumeId}`;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, latex: code })
            });
            const data = await res.json();
            if (resumeId === 'new' && data.id) {
                router.push(`/admin/resumes/${data.id}`);
            }
        } catch (error) {
            console.error("Save failed:", error);
        } finally {
            setIsSaving(false);
        }
    };

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
