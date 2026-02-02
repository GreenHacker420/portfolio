
"use client";

import { useState, useEffect } from "react";
import { render } from "@react-email/render";
import AdminTemplate from "@/emails/AdminTemplate";
import ContactReplyEmail from "@/emails/ContactTemplate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TemplatesPage() {
    const [adminHtml, setAdminHtml] = useState("");
    const [userHtml, setUserHtml] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function renderTemplates() {
            try {
                const admin = await render(
                    <AdminTemplate
                        name="John Doe"
                        email="john@example.com"
                        subject="Project Inquiry"
                        message="Hi, I'd like to hire you for a secret project involving blockchain and AI."
                        date={new Date().toLocaleString()}
                    />
                );

                const user = await render(
                    <ContactReplyEmail
                        customerName="John Doe"
                    />
                );

                setAdminHtml(admin);
                setUserHtml(user);
            } catch (error) {
                console.error("Failed to render email templates:", error);
            } finally {
                setLoading(false);
            }
        }

        renderTemplates();
    }, []);

    return (
        <div className="p-8 space-y-8 max-w-[1200px] mx-auto text-zinc-100">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Email Templates</h1>
                    <p className="text-zinc-400 mt-2">Preview system notification and response templates</p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-[600px]">
                    <div className="text-zinc-500">Rendering templates...</div>
                </div>
            ) : (
                <Tabs defaultValue="admin" className="w-full">
                    <TabsList className="bg-zinc-900 border border-zinc-800">
                        <TabsTrigger value="admin" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Admin Notification</TabsTrigger>
                        <TabsTrigger value="user" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">User Acknowledgment</TabsTrigger>
                    </TabsList>

                    <TabsContent value="admin" className="mt-8">
                        <PreviewContainer title="Admin Notification (Sent to You)" html={adminHtml} />
                    </TabsContent>

                    <TabsContent value="user" className="mt-8">
                        <PreviewContainer title="User Acknowledgment (Sent to Client)" html={userHtml} />
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}

// Helper to render HTML in an iframe for proper isolation
function PreviewContainer({ html, title }) {
    return (
        <Card className="bg-zinc-950 border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-300">{title}</span>
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                </div>
            </div>
            <div className="p-8 flex justify-center bg-black/50 min-h-[600px]">
                <iframe
                    srcDoc={html}
                    className="w-full max-w-[700px] h-[700px] bg-white border border-zinc-800 shadow-2xl"
                    title={title}
                    sandbox="allow-same-origin"
                />
            </div>
        </Card>
    );
}
