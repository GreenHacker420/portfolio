import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

async function fetchLeads() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/admin/job-leads`, { cache: "no-store" });
    return res.json();
}

export const dynamic = 'force-dynamic';

export default async function JobLeadsPage() {
    const leads = await fetchLeads();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Job Leads</h1>
                    <p className="text-zinc-500">Normalized OSINT intake.</p>
                </div>
            </div>
            <div className="grid gap-4">
                {leads.map((lead) => (
                    <Card key={lead.id} className="bg-zinc-900/60 border-zinc-800 p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <div className="text-white font-semibold">{lead.title}</div>
                                <div className="text-zinc-400 text-sm">{lead.company} • {lead.location || "Remote/unspecified"}</div>
                                <div className="text-xs text-zinc-500 mt-1">{lead.source?.name}</div>
                            </div>
                            <Badge variant="outline" className="border-emerald-500/40 text-emerald-400">{lead.status}</Badge>
                        </div>
                        {lead.description && <p className="text-sm text-zinc-400 mt-2 line-clamp-2">{lead.description}</p>}
                        {lead.url && (
                            <a className="text-emerald-400 text-sm" href={lead.url} target="_blank" rel="noreferrer">Open posting →</a>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
