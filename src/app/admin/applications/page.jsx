import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

async function fetchApps() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/admin/applications`, { cache: "no-store" });
    return res.json();
}

export const dynamic = 'force-dynamic';

export default async function ApplicationsPage() {
    const apps = await fetchApps();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Applications</h1>
                <p className="text-zinc-500">Track apply → follow-up → replies.</p>
            </div>
            <div className="grid gap-4">
                {apps.map(app => (
                    <Card key={app.id} className="bg-zinc-900/60 border-zinc-800 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-white font-semibold">{app.lead?.title}</div>
                                <div className="text-zinc-400 text-sm">{app.lead?.company}</div>
                                <div className="text-xs text-zinc-500">Recruiter: {app.recruiter?.email || "N/A"}</div>
                            </div>
                            <Badge variant="outline" className="border-emerald-500/40 text-emerald-400">{app.status}</Badge>
                        </div>
                        <div className="text-xs text-zinc-500 mt-2">Events: {app.events?.length || 0}</div>
                        <form
                            className="mt-3 flex gap-2 items-center"
                            action={async (formData) => {
                                "use server";
                                const followupAt = formData.get("followupAt");
                                await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/admin/applications/${app.id}/followup`, {
                                    method: "POST",
                                    body: JSON.stringify({ followupAt }),
                                    headers: { "Content-Type": "application/json" }
                                });
                                revalidatePath("/admin/applications");
                            }}
                        >
                            <input
                                type="datetime-local"
                                name="followupAt"
                                className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-white"
                                defaultValue={app.followupAt ? new Date(app.followupAt).toISOString().slice(0, 16) : ""}
                            />
                            <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-black text-xs">Schedule follow-up</Button>
                        </form>
                    </Card>
                ))}
            </div>
        </div>
    );
}
