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
import { deleteFAQ } from "@/actions/faqs";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export const columns = [
    {
        accessorKey: "question",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Question
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => <Badge variant="outline">{row.original.category}</Badge>
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
            const faq = row.original;
            const router = useRouter();
            const [isPending, startTransition] = useTransition();

            const handleDelete = () => {
                if (confirm("Are you sure you want to delete this FAQ?")) {
                    startTransition(async () => {
                        const result = await deleteFAQ(faq.id);
                        if (result.success) {
                            toast.success("FAQ deleted");
                            router.refresh();
                        } else {
                            toast.error("Failed to delete FAQ");
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
                            onClick={() => navigator.clipboard.writeText(faq.id)}
                            className="focus:bg-zinc-900 focus:text-zinc-100"
                        >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem asChild className="focus:bg-zinc-900 focus:text-zinc-100">
                            <Link href={`/admin/faqs/${faq.id}`}>
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
