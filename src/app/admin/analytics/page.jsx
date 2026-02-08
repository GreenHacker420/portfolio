import { getAnalyticsSummary } from "@/actions/analytics";
import { Card } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

function Stat({ label, value, suffix }) {
    return (
        <Card className="bg-zinc-900/60 border-zinc-800 p-4">
            <div className="text-sm text-zinc-500">{label}</div>
            <div className="text-3xl font-bold text-white flex items-center gap-2">
                {value}
                {suffix && <span className="text-sm text-zinc-500">{suffix}</span>}
            </div>
        </Card>
    );
}

export default async function AnalyticsPage() {
    const summary = await getAnalyticsSummary(7);
    const events = summary.events.reduce((acc, ev) => ({ ...acc, [ev.type]: ev.count }), {});

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Analytics</h1>
                    <p className="text-zinc-500">Last 7 days — privacy-first tracking.</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <Link href="/api/admin/analytics/export?days=7" className="px-3 py-1 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700">Export CSV</Link>
                    <div className="flex items-center gap-2 text-emerald-400">
                        Auto rollup <ArrowUpRight className="w-4 h-4" />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Stat label="Sessions" value={summary.sessions} />
                <Stat label="Pageviews" value={summary.pageviews} />
                <Stat label="Events" value={summary.events.reduce((s, e) => s + e.count, 0)} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-zinc-900/60 border-zinc-800 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Event Breakdown</h2>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        {summary.events.map(ev => (
                            <div key={ev.type} className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                                <div className="text-zinc-500 uppercase text-xs">{ev.type}</div>
                                <div className="text-xl font-semibold text-white">{ev.count}</div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="bg-zinc-900/60 border-zinc-800 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Engagement</h2>
                    <div className="space-y-3 text-sm text-white">
                        <div className="flex justify-between">
                            <span className="text-zinc-500">Avg scroll depth</span>
                            <span>{Math.round(summary.scrollAvg || 0)}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-500">Avg time on page</span>
                            <span>{Math.round((summary.timeOnPageMs || 0) / 1000)}s</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-500">CTA clicks</span>
                            <span>{events["cta_click"] || 0}</span>
                        </div>
                    </div>
                </Card>

                <Card className="bg-zinc-900/60 border-zinc-800 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Funnel (Sessions → Pageviews → CTA)</h2>
                    <div className="space-y-2 text-sm text-white">
                        {["Sessions", "Pageviews", "CTA Clicks"].map((label, idx) => {
                            const value = idx === 0 ? summary.sessions : idx === 1 ? summary.pageviews : (events["cta_click"] || 0);
                            const max = Math.max(summary.sessions, summary.pageviews, (events["cta_click"] || 1));
                            const pct = max ? Math.round((value / max) * 100) : 0;
                            return (
                                <div key={label}>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">{label}</span>
                                        <span>{value}</span>
                                    </div>
                                    <div className="h-2 bg-zinc-800 rounded">
                                        <div className="h-2 bg-emerald-500 rounded" style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-zinc-900/60 border-zinc-800 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Top Referrers</h2>
                    <div className="space-y-2 text-sm">
                        {summary.referrers.map(r => (
                            <div key={r.referrer} className="flex justify-between text-zinc-200">
                                <span className="truncate">{r.referrer}</span>
                                <span className="text-zinc-500">{r.count}</span>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card className="bg-zinc-900/60 border-zinc-800 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Top UTM</h2>
                    <div className="space-y-2 text-sm">
                        {summary.utm.map((u, idx) => (
                            <div key={idx} className="flex justify-between text-zinc-200">
                                <span className="truncate">{u.source || "(none)"} / {u.campaign || "(na)"}</span>
                                <span className="text-zinc-500">{u.count}</span>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card className="bg-zinc-900/60 border-zinc-800 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Geo (coarse)</h2>
                    <div className="space-y-2 text-sm">
                        {summary.geo.map((g, idx) => (
                            <div key={idx} className="flex justify-between text-zinc-200">
                                <span className="truncate">{g.country || "??"} {g.city ? `• ${g.city}` : ""}</span>
                                <span className="text-zinc-500">{g.count}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
