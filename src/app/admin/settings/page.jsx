"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save, RefreshCw } from "lucide-react";

const FIELDS = [
    { key: "GOOGLE_API_KEY", label: "Google API Key" },
    { key: "GOOGLE_CSE_ID", label: "Google CSE ID" },
    { key: "PINECONE_API_KEY", label: "Pinecone API Key" },
    { key: "PINECONE_INDEX_NAME", label: "Pinecone Index Name" },
    { key: "JSEARCH_API_KEY", label: "JSearch API Key (RapidAPI)" },
    { key: "ADZUNA_APP_ID", label: "Adzuna App ID" },
    { key: "ADZUNA_API_KEY", label: "Adzuna API Key" },
    { key: "EMAIL_USER", label: "Email Sender (Graph)" },
    { key: "LATEX_REMOTE_COMPILE", label: "Enable Remote LaTeX Compile", type: "boolean" },
];

export default function AdminSettingsPage() {
    const [values, setValues] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        setLoading(true);
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        const map = {};
        data.forEach(s => { map[s.key] = s.value; });
        setValues(map);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const update = (key, val) => setValues(v => ({ ...v, [key]: val }));

    const save = async () => {
        setSaving(true);
        const payload = FIELDS.map(f => ({ key: f.key, value: values[f.key] || "" }));
        await fetch("/api/admin/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        setSaving(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Settings</h1>
                    <p className="text-zinc-500 text-sm">Configure integrations and feature toggles.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={load} disabled={loading}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button onClick={save} disabled={saving} className="bg-emerald-500 text-black">
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? "Saving..." : "Save"}
                    </Button>
                </div>
            </div>

            <Card className="bg-zinc-900/60 border-zinc-800 p-6 space-y-4">
                {FIELDS.map(field => (
                    <div key={field.key} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                        <Label className="text-zinc-200">{field.label}</Label>
                        {field.type === "boolean" ? (
                            <Switch
                                checked={values[field.key] === "true"}
                                onCheckedChange={(v) => update(field.key, v ? "true" : "false")}
                            />
                        ) : (
                            <Input
                                type="password"
                                placeholder={`Enter ${field.label}`}
                                value={values[field.key] || ""}
                                onChange={(e) => update(field.key, e.target.value)}
                                className="col-span-2 bg-zinc-950 border-zinc-800"
                            />
                        )}
                        {field.type !== "boolean" && <div className="hidden md:block" />}
                    </div>
                ))}
            </Card>
        </div>
    );
}
