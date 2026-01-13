"use client";

import { ArrowUpDown, MoreHorizontal, Copy, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { deleteSocialLink } from "@/actions/social-links";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export const columns = [
    {
        accessorKey: "platform",
        header: "Platform",
    },
    {
        accessorKey: "username",
        header: "Username",
    },
    {
        accessorKey: "url",
        header: "URL",
        cell: ({ row }) => (
            <a href={row.original.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate max-w-[200px] block">
                {row.original.url}
            </a>
        )
    },
    {
        accessorKey: "isVisible",
        header: "Visibility",
        cell: ({ row }) => {
            return (
                <Badge variant={row.original.isVisible ? "default" : "secondary"}>
                    {row.original.isVisible ? "Public" : "Hidden"}
                </Badge>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const link = row.original;
            const router = useRouter();
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [isPending, startTransition] = useTransition();

            const handleDelete = () => {
                if (confirm("Are you sure you want to delete this link?")) {
                    startTransition(async () => {
                        const result = await deleteSocialLink(link.id);
                        if (result.success) {
                            toast.success("Link deleted");
                            router.refresh();
                        } else {
                            toast.error("Failed to delete link");
                        }
                    });
                }
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800 text-zinc-200">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(link.id)}
                            className="focus:bg-zinc-900 focus:text-zinc-100"
                        >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem asChild className="focus:bg-zinc-900 focus:text-zinc-100">
                            <Link href={`/admin/social-links/${link.id}`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleDelete}
                            className="focus:bg-red-900/20 focus:text-red-400 text-red-400"
                            disabled={isPending}
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
