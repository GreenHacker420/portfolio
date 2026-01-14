import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function MessageDetailsPage({ params }) {
    const { id } = await params;
    const message = await prisma.contact.findUnique({
        where: { id },
    });

    if (!message) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="icon">
                    <Link href="/admin/messages">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight text-white">Message Details</h1>
            </div>

            <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
                <CardHeader>
                    <CardTitle>{message.subject}</CardTitle>
                    <div className="text-sm text-zinc-400">
                        From: {message.name} &lt;{message.email}&gt;
                    </div>
                    <div className="text-xs text-zinc-500">
                        Date: {new Date(message.createdAt).toLocaleString()}
                    </div>
                </CardHeader>
                <CardContent className="pt-6 border-t border-zinc-800 mt-4">
                    <p className="whitespace-pre-wrap">{message.message}</p>
                </CardContent>
            </Card>
        </div>
    );
}
