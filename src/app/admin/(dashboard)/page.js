
'use client';
import React from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FolderGit2, Eye, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-neutral-400">Welcome back, Admin. Here's what's happening.</p>
                </div>
                <Link href="/admin/projects/new">
                    <Button className="bg-neon-green text-black hover:bg-neon-green/90 font-bold">
                        <Plus className="mr-2 h-4 w-4" /> New Project
                    </Button>
                </Link>
            </div>

            {/* Stats Row */}
            <div className="grid gap-4 md:grid-cols-3">
                <StatCard title="Total Projects" value="12" icon={FolderGit2} delay={0} />
                <StatCard title="Total Views" value="45.2k" icon={Eye} delay={0.1} />
                <StatCard title="New Messages" value="3" icon={MessageSquare} delay={0.2} />
            </div>

            {/* Quick Actions / Recent */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-neutral-900/50 border-white/10 text-white">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription className="text-neutral-400">You made 24 commits this month.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] flex items-center justify-center text-neutral-500 border border-dashed border-neutral-800 rounded-lg">
                            Chart Placeholder
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 bg-neutral-900/50 border-white/10 text-white">
                    <CardHeader>
                        <CardTitle>Recent Projects</CardTitle>
                        <CardDescription className="text-neutral-400">Recently updated projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {["Portfolio V2", "AI Agent", "E-commerce Platform"].map((project, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-neon-green" />
                                        <span className="font-medium">{project}</span>
                                    </div>
                                    <span className="text-xs text-neutral-500">2h ago</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
