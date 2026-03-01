"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, FileText, Trash2, Edit, Loader2 } from 'lucide-react';
import AdminContentWrapper from '@/components/admin/AdminContentWrapper';

export default function ResumeListPage() {
    const [resumes, setResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/resumes')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setResumes(data);
                } else {
                    console.error("API Error:", data);
                    setResumes([]);
                }
                setIsLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this resume?")) return;

        await fetch(`/api/admin/resumes/${id}`, { method: 'DELETE' });
        setResumes(resumes.filter(r => r.id !== id));
    };

    return (
        <AdminContentWrapper
            title="Resume Management"
            actions={
                <Link href="/admin/resumes/new">
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-black">
                        <Plus className="h-4 w-4 mr-2" />
                        New Resume
                    </Button>
                </Link>
            }
        >
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                </div>
            ) : resumes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 border border-dashed border-zinc-800 rounded-xl">
                    <FileText className="h-12 w-12 text-zinc-700 mb-4" />
                    <h3 className="text-lg font-semibold text-zinc-400 mb-1">No resumes yet</h3>
                    <p className="text-sm text-zinc-600 mb-4">Create your first resume to get started.</p>
                    <Link href="/admin/resumes/new">
                        <Button className="bg-emerald-500 hover:bg-emerald-600 text-black">
                            <Plus className="h-4 w-4 mr-2" /> New Resume
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resumes.map(resume => (
                        <Card key={resume.id} className="bg-zinc-900 border-zinc-800 hover:border-emerald-500/50 transition-colors">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                        <FileText className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    {resume.isDefault && (
                                        <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full border border-emerald-500/20">
                                            Default
                                        </span>
                                    )}
                                </div>

                                <h3 className="font-bold text-zinc-100 mb-1">{resume.title}</h3>
                                <p className="text-xs text-zinc-500 mb-6">
                                    Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                                </p>

                                <div className="flex gap-2">
                                    <Link href={`/admin/resumes/${resume.id}`} className="flex-1">
                                        <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800">
                                            <Edit className="h-3 w-3 mr-2" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                        onClick={() => handleDelete(resume.id)}
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
