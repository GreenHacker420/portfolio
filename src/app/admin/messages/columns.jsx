"use client";

import { ArrowUpDown, MoreHorizontal, Eye, Trash } from "lucide-react";
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
import { deleteContact } from "@/actions/contact";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export const columns = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "subject",
        header: "Subject",
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const message = row.original;
            const router = useRouter();
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [isPending, startTransition] = useTransition();

            const handleDelete = () => {
                if (confirm("Are you sure you want to delete this message?")) {
                    startTransition(async () => {
                        const result = await deleteContact(message.id);
                        if (result.success) {
                            toast.success("Message deleted");
                            router.refresh();
                        } else {
                            toast.error("Failed to delete message");
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
                        <DropdownMenuItem asChild className="focus:bg-zinc-900 focus:text-zinc-100">
                            <Link href={`/admin/messages/${message.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800" />
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
