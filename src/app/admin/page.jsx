import { getAdminStats } from "@/actions/admin";
import Link from 'next/link';
import {
    FolderGit2, MessageSquare, Cpu, FileText, BrainCircuit,
    Image as ImageIcon, Briefcase, Award, GraduationCap,
    CheckCircle2, XCircle, Clock, AlertTriangle, Activity,
    ArrowUpRight, Mail, Shield
} from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const stats = await getAdminStats();

    if (stats.error) {
        return <div className="text-red-500">Error loading stats</div>;
    }

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    System Overview
                </h1>
                <p className="text-zinc-500 mt-2">Welcome back to the command center.</p>
            </header>

            {/* ===== Stat Cards Grid ===== */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatCard
                    label="Projects"
                    value={stats.projects}
                    icon={<FolderGit2 className="w-5 h-5" />}
                    href="/admin/projects"
                    color="emerald"
                />
                <StatCard
                    label="Pending Messages"
                    value={stats.pendingMessages}
                    icon={<MessageSquare className="w-5 h-5" />}
                    href="/admin/messages"
                    color={stats.pendingMessages > 0 ? "red" : "zinc"}
                    alert={stats.pendingMessages > 0}
                    subtitle={`${stats.messages} total`}
                />
                <StatCard
                    label="Skills"
                    value={stats.skills}
                    icon={<Cpu className="w-5 h-5" />}
                    href="/admin/skills"
                    color="blue"
                />
                <StatCard
                    label="KB Snippets"
                    value={stats.kbSnippets}
                    icon={<BrainCircuit className="w-5 h-5" />}
                    href="/admin/kb"
                    color="violet"
                />
                <StatCard
                    label="Resumes"
                    value={stats.resumes}
                    icon={<FileText className="w-5 h-5" />}
                    href="/admin/resumes"
                    color="amber"
                />
                <StatCard
                    label="Media Files"
                    value={stats.media}
                    icon={<ImageIcon className="w-5 h-5" />}
                    href="/admin/media"
                    color="cyan"
                />
                <StatCard
                    label="Experience"
                    value={stats.experience}
                    icon={<Briefcase className="w-5 h-5" />}
                    href="/admin/experience"
                    color="orange"
                />
                <StatCard
                    label="Certifications"
                    value={stats.certifications}
                    icon={<Award className="w-5 h-5" />}
                    href="/admin/certifications"
                    color="pink"
                />
                <StatCard
                    label="Education"
                    value={stats.education}
                    icon={<GraduationCap className="w-5 h-5" />}
                    href="/admin/education"
                    color="indigo"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ===== Recent Activity Feed ===== */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-emerald-500" />
                            Recent Activity
                        </h2>
                        <Link href="/admin/messages" className="text-xs text-emerald-500 hover:text-emerald-400 flex items-center gap-1">
                            View all <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>

                    {stats.recentContacts && stats.recentContacts.length > 0 ? (
                        <div className="space-y-3">
                            {stats.recentContacts.map((contact) => (
                                <Link
                                    key={contact.id}
                                    href={`/admin/messages/${contact.id}`}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50 hover:border-zinc-700 transition-colors group"
                                >
                                    <div className="mt-0.5 flex-shrink-0">
                                        <StatusDot status={contact.status} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors truncate">
                                                {contact.name}
                                            </span>
                                            <InquiryBadge type={contact.inquiryType} />
                                        </div>
                                        <p className="text-xs text-zinc-500 truncate">{contact.subject}</p>
                                        <p className="text-[10px] text-zinc-600 mt-0.5">
                                            {timeAgo(contact.createdAt)}
                                        </p>
                                    </div>
                                    <PriorityBadge priority={contact.priority} />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-zinc-600 text-center py-8">No recent contacts</p>
                    )}
                </div>

                {/* ===== System Health ===== */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2 mb-5">
                        <Shield className="w-5 h-5 text-emerald-500" />
                        System Health
                    </h2>
                    <div className="space-y-2">
                        <HealthRow label="Database" status={stats.systemHealth?.database} />
                        <HealthRow label="Google AI (Gemini)" status={stats.systemHealth?.google} />
                        <HealthRow label="Pinecone (Vector DB)" status={stats.systemHealth?.pinecone} />
                        <HealthRow label="Azure (Email)" status={stats.systemHealth?.azure} />
                        <HealthRow label="Email User" status={stats.systemHealth?.email} />
                        <HealthRow label="GitHub Token" status={stats.systemHealth?.github} />
                    </div>

                    <div className="mt-6 pt-4 border-t border-zinc-800">
                        <h3 className="text-sm font-medium text-zinc-400 mb-3">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <QuickAction href="/admin/projects" label="Projects" />
                            <QuickAction href="/admin/skills" label="Skills" />
                            <QuickAction href="/admin/media" label="Media" />
                            <QuickAction href="/admin/messages" label="Messages" />
                            <QuickAction href="/admin/settings" label="Settings" />
                            <QuickAction href="/admin/kb" label="Knowledge Base" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// COMPONENTS
// ============================================================

function StatCard({ label, value, icon, href, color = "zinc", alert, subtitle }) {
    const colorMap = {
        emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
        blue: "text-blue-400 border-blue-500/20 bg-blue-500/5",
        violet: "text-violet-400 border-violet-500/20 bg-violet-500/5",
        red: "text-red-400 border-red-500/20 bg-red-500/5",
        zinc: "text-zinc-400 border-zinc-800 bg-zinc-900/50",
        amber: "text-amber-400 border-amber-500/20 bg-amber-500/5",
        cyan: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
        orange: "text-orange-400 border-orange-500/20 bg-orange-500/5",
        pink: "text-pink-400 border-pink-500/20 bg-pink-500/5",
        indigo: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
    };

    return (
        <Link href={href} className={`p-5 rounded-xl border ${colorMap[color] || colorMap.zinc} transition-all hover:scale-[1.02] group`}>
            <div className="flex items-center justify-between mb-3">
                <div className={`opacity-60 group-hover:opacity-100 transition-opacity`}>{icon}</div>
                {alert && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
            </div>
            <div className="text-2xl font-bold text-white tabular-nums">{value}</div>
            <div className="text-zinc-500 text-xs font-medium uppercase tracking-wider mt-1">{label}</div>
            {subtitle && <div className="text-[10px] text-zinc-600 mt-0.5">{subtitle}</div>}
        </Link>
    );
}

function HealthRow({ label, status }) {
    return (
        <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-zinc-800/30 transition-colors">
            <span className="text-sm text-zinc-300">{label}</span>
            {status ? (
                <span className="flex items-center gap-1.5 text-xs text-emerald-500">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                </span>
            ) : (
                <span className="flex items-center gap-1.5 text-xs text-zinc-600">
                    <XCircle className="w-3.5 h-3.5" /> Not configured
                </span>
            )}
        </div>
    );
}

function QuickAction({ href, label }) {
    return (
        <Link href={href} className="p-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors text-center text-sm text-zinc-300 hover:text-white">
            {label}
        </Link>
    );
}

function StatusDot({ status }) {
    const colors = {
        pending: "bg-yellow-500",
        responded: "bg-emerald-500",
        archived: "bg-zinc-600",
        spam: "bg-red-500",
    };
    return <div className={`w-2 h-2 rounded-full ${colors[status] || colors.pending}`} />;
}

function InquiryBadge({ type }) {
    if (!type || type === "GENERAL") return null;
    const styles = {
        PROJECT: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        JOB: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    };
    return (
        <span className={`text-[9px] px-1.5 py-0.5 rounded-md border ${styles[type] || ""} uppercase tracking-wider font-medium`}>
            {type}
        </span>
    );
}

function PriorityBadge({ priority }) {
    if (!priority || priority === "normal") return null;
    const styles = {
        high: "text-orange-400",
        urgent: "text-red-400",
        low: "text-zinc-600",
    };
    return (
        <AlertTriangle className={`w-3.5 h-3.5 flex-shrink-0 ${styles[priority] || ""}`} />
    );
}

function timeAgo(date) {
    const now = new Date();
    const d = new Date(date);
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return d.toLocaleDateString();
}
