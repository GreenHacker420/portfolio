import { getAdminStats } from "@/actions/admin";
import Link from 'next/link';

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Active Projects"
                    value={stats.projects}
                    trend="+2 this week"
                    color="emerald"
                />
                <StatCard
                    label="Skill Nodes"
                    value={stats.skills}
                    trend="Stable"
                    color="blue"
                />
                <StatCard
                    label="Total Messages"
                    value={stats.messages}
                    trend="Inbound traffic"
                    color="violet"
                />
                <StatCard
                    label="Pending Actions"
                    value={stats.unreadMessages}
                    alert={stats.unreadMessages > 0}
                    trend="Requires attention"
                    color={stats.unreadMessages > 0 ? "red" : "zinc"}
                />
            </div>

            {/* Quick Actions Area or Recent Activity could go here */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-zinc-100 mb-4">Quick Navigation</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/admin/projects" className="p-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors text-center">
                            Admin Projects
                        </Link>
                        <Link href="/admin/skills" className="p-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors text-center">
                            Manage Skills
                        </Link>
                        <Link href="/admin/media" className="p-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors text-center">
                            Upload Media
                        </Link>
                        <Link href="/admin/contacts" className="p-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors text-center">
                            View Messages
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, trend, color, alert }) {
    const colors = {
        emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
        blue: "text-blue-400 border-blue-500/20 bg-blue-500/5",
        violet: "text-violet-400 border-violet-500/20 bg-violet-500/5",
        red: "text-red-400 border-red-500/20 bg-red-500/5",
        zinc: "text-zinc-400 border-zinc-800 bg-zinc-900/50"
    };

    const activeColor = colors[color] || colors.zinc;

    return (
        <div className={`p-6 rounded-xl border ${activeColor} transition-all hover:scale-[1.02]`}>
            <div className="text-zinc-500 text-sm font-medium uppercase tracking-wider">{label}</div>
            <div className="mt-2 text-3xl font-bold text-white tabular-nums">{value}</div>
            <div className={`mt-2 text-xs font-mono flex items-center gap-2 ${alert ? 'text-red-400 animate-pulse' : 'text-zinc-500'}`}>
                {alert && <span className="w-2 h-2 rounded-full bg-red-500" />}
                {trend}
            </div>
        </div>
    );
}
