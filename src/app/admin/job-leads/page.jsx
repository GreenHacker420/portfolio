import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
                        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
                            <span>Match: {lead.matchScore ? (lead.matchScore * 100).toFixed(1) + "%" : "—"}</span>
                            {lead.missingSkills && (
                                <span className="text-red-400 truncate max-w-[200px]">Missing: {lead.missingSkills}</span>
                            )}
                            <form
                                action={async (formData) => {
                                    "use server";
                                    const cv = formData.get("cv");
                                    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/admin/job-leads/score`, {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ leadId: lead.id, cvText: cv })
                                    });
                                }}
                                className="flex gap-2 items-center"
                            >
                                <textarea name="cv" required className="hidden" defaultValue="Paste CV text here" />
                                <Button type="submit" size="sm" variant="outline" className="border-emerald-500/40 text-emerald-400">
                                    Score vs CV
                                </Button>
                            </form>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
