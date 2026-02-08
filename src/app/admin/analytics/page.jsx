import { getAnalyticsSummary } from "@/actions/analytics";
import { Card } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

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
                <div className="flex items-center gap-2 text-emerald-400 text-sm">
                    Auto rollup <ArrowUpRight className="w-4 h-4" />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Stat label="Sessions" value={summary.sessions} />
                <Stat label="Pageviews" value={summary.pageviews} />
                <Stat label="Events" value={summary.events.reduce((s, e) => s + e.count, 0)} />
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Event Breakdown</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    {summary.events.map(ev => (
                        <div key={ev.type} className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                            <div className="text-zinc-500 uppercase text-xs">{ev.type}</div>
                            <div className="text-xl font-semibold text-white">{ev.count}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
