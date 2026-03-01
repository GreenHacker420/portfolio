"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save, RefreshCw, Shield, BrainCircuit, Mail, Github, Briefcase, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const SETTINGS_GROUPS = [
    {
        label: "AI & Search",
        icon: <BrainCircuit className="w-5 h-5 text-violet-400" />,
        description: "Configure AI, embeddings, and search integrations.",
        fields: [
            { key: "GOOGLE_API_KEY", label: "Google API Key (Gemini)" },
            { key: "GOOGLE_CSE_ID", label: "Google Custom Search Engine ID" },
            { key: "PINECONE_API_KEY", label: "Pinecone API Key" },
            { key: "PINECONE_INDEX_NAME", label: "Pinecone Index Name", sensitive: false },
        ],
    },
    {
        label: "Email (Azure Graph)",
        icon: <Mail className="w-5 h-5 text-blue-400" />,
        description: "Azure AD credentials for Microsoft Graph mail integration.",
        fields: [
            { key: "AZURE_CLIENT_ID", label: "Azure Client ID" },
            { key: "AZURE_TENANT_ID", label: "Azure Tenant ID" },
            { key: "AZURE_CLIENT_SECRET", label: "Azure Client Secret" },
            { key: "EMAIL_USER", label: "Email User (sender address)", sensitive: false },
        ],
    },
    {
        label: "GitHub",
        icon: <Github className="w-5 h-5 text-zinc-300" />,
        description: "Personal access token for GitHub stats and analysis.",
        fields: [
            { key: "GITHUB_TOKEN", label: "GitHub Personal Access Token" },
        ],
    },
    {
        label: "Job Search",
        icon: <Briefcase className="w-5 h-5 text-amber-400" />,
        description: "API keys for job lead discovery and matching.",
        fields: [
            { key: "JSEARCH_API_KEY", label: "JSearch API Key (RapidAPI)" },
            { key: "ADZUNA_APP_ID", label: "Adzuna App ID" },
            { key: "ADZUNA_API_KEY", label: "Adzuna API Key" },
        ],
    },
    {
        label: "Feature Toggles",
        icon: <Shield className="w-5 h-5 text-emerald-400" />,
        description: "Enable or disable features.",
        fields: [
            { key: "LATEX_REMOTE_COMPILE", label: "Enable Remote LaTeX Compile", type: "boolean" },
        ],
    },
];

export default function AdminSettingsPage() {
    const [values, setValues] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [visibleFields, setVisibleFields] = useState({});

    const load = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/settings");
            const data = await res.json();
            const map = {};
            data.forEach(s => { map[s.key] = s.value; });
            setValues(map);
        } catch (err) {
            toast.error("Failed to load settings");
        }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const update = (key, val) => setValues(v => ({ ...v, [key]: val }));

    const toggleVisibility = (key) => setVisibleFields(v => ({ ...v, [key]: !v[key] }));

    const allFields = SETTINGS_GROUPS.flatMap(g => g.fields);

    const save = async () => {
        setSaving(true);
        try {
            const payload = allFields.map(f => ({ key: f.key, value: values[f.key] || "" }));
            await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            toast.success("Settings saved");
        } catch {
            toast.error("Failed to save settings");
        }
        setSaving(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Settings</h1>
                    <p className="text-zinc-500 text-sm">Configure integrations, API keys, and feature toggles.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={load} disabled={loading} className="border-zinc-700">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button onClick={save} disabled={saving} className="bg-emerald-500 text-black hover:bg-emerald-600">
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? "Saving..." : "Save All"}
                    </Button>
                </div>
            </div>

            {SETTINGS_GROUPS.map((group) => (
                <Card key={group.label} className="bg-zinc-900/60 border-zinc-800 p-6">
                    <div className="flex items-center gap-3 mb-1">
                        {group.icon}
                        <h2 className="text-lg font-semibold text-white">{group.label}</h2>
                    </div>
                    <p className="text-xs text-zinc-500 mb-5 ml-8">{group.description}</p>

                    <div className="space-y-4 ml-8">
                        {group.fields.map(field => (
                            <div key={field.key} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                                <Label className="text-zinc-300 text-sm">{field.label}</Label>
                                {field.type === "boolean" ? (
                                    <div className="col-span-2">
                                        <Switch
                                            checked={values[field.key] === "true"}
                                            onCheckedChange={(v) => update(field.key, v ? "true" : "false")}
                                        />
                                    </div>
                                ) : (
                                    <div className="col-span-2 relative">
                                        <Input
                                            type={field.sensitive === false || visibleFields[field.key] ? "text" : "password"}
                                            placeholder={`Enter ${field.label}`}
                                            value={values[field.key] || ""}
                                            onChange={(e) => update(field.key, e.target.value)}
                                            className="bg-zinc-950 border-zinc-800 pr-10"
                                        />
                                        {field.sensitive !== false && (
                                            <button
                                                type="button"
                                                onClick={() => toggleVisibility(field.key)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
                                            >
                                                {visibleFields[field.key]
                                                    ? <EyeOff className="w-4 h-4" />
                                                    : <Eye className="w-4 h-4" />}
                                            </button>
                                        )}
                                        {values[field.key] && (
                                            <span className="absolute -right-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500" title="Configured" />
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            ))}
        </div>
    );
}
