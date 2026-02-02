"use client";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMail } from "@/components/admin/mail/use-mail";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function MailList({ items }) {
    const { selected, setSelected } = useMail();
    const [search, setSearch] = useState("");

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-zinc-800 backdrop-blur-sm bg-zinc-900/50 sticky top-0 z-10">
                <h1 className="text-xl font-bold mb-4 text-emerald-500 font-mono">INBOX</h1>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search emails..."
                        className="pl-8 bg-zinc-950/50 border-zinc-800 focus-visible:ring-emerald-500/50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <ScrollArea className="flex-1">
                <div className="flex flex-col gap-2 p-4 pt-0">
                    {items.map((item) => (
                        <button
                            key={item.id}
                            className={cn(
                                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-zinc-800/50",
                                selected === item.id
                                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-100"
                                    : "bg-zinc-900/40 border-zinc-800/50 hover:border-zinc-700 text-zinc-400"
                            )}
                            onClick={() => setSelected(item.id)}
                        >
                            <div className="flex w-full flex-col gap-1">
                                <div className="flex items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="font-semibold text-white">
                                            {item.from?.emailAddress?.name}
                                        </div>
                                        {!item.isRead && (
                                            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                                        )}
                                    </div>
                                    <div
                                        className={cn(
                                            "ml-auto text-xs",
                                            selected === item.id
                                                ? "text-emerald-400"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {formatDistanceToNow(new Date(item.receivedDateTime), {
                                            addSuffix: true,
                                        })}
                                    </div>
                                </div>
                                <div className="text-xs font-medium">{item.subject}</div>
                            </div>
                            <div className="line-clamp-2 text-xs text-muted-foreground">
                                {item.bodyPreview.substring(0, 300)}
                            </div>
                            {item.labels?.length ? (
                                <div className="flex items-center gap-2">
                                    {item.labels.map((label) => (
                                        <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                                            {label}
                                        </Badge>
                                    ))}
                                </div>
                            ) : null}
                        </button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}

function getBadgeVariantFromLabel(label) {
    if (["work"].includes(label.toLowerCase())) {
        return "default";
    }
    if (["personal"].includes(label.toLowerCase())) {
        return "outline";
    }
    return "secondary";
}
