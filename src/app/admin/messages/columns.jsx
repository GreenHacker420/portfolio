"use client";

import { MoreHorizontal, ArrowUpDown, Mail, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteContact, updateContactStatus } from "@/actions/contact";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const statusStyles = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    responded: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    archived: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    spam: "bg-red-500/10 text-red-400 border-red-500/20",
};

const priorityStyles = {
    low: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
    normal: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    urgent: "bg-red-500/10 text-red-400 border-red-500/20",
};

const inquiryStyles = {
    GENERAL: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    PROJECT: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    JOB: "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

function Badge({ children, className }) {
    return (
        <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wider", className)}>
            {children}
        </span>
    );
}

export const columns = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Name <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <span className="font-medium text-white">{row.getValue("name")}</span>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <span className="text-zinc-400">{row.getValue("email")}</span>
        ),
    },
    {
        accessorKey: "subject",
        header: "Subject",
        cell: ({ row }) => (
            <div className="truncate max-w-[200px] text-zinc-300" title={row.getValue("subject")}>
                {row.getValue("subject")}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") || "pending";
            return <Badge className={statusStyles[status]}>{status}</Badge>;
        },
    },
    {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
            const priority = row.getValue("priority") || "normal";
            return <Badge className={priorityStyles[priority]}>{priority}</Badge>;
        },
    },
    {
        accessorKey: "inquiryType",
        header: "Type",
        cell: ({ row }) => {
            const type = row.getValue("inquiryType") || "GENERAL";
            return <Badge className={inquiryStyles[type]}>{type}</Badge>;
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Date <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"));
            return <span className="text-zinc-500 text-xs">{date.toLocaleDateString()}</span>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const contact = row.original;
            const router = useRouter();

            const handleDelete = async () => {
                const result = await deleteContact(contact.id);
                if (result.success) {
                    toast.success("Message deleted");
                    router.refresh();
                } else {
                    toast.error("Failed to delete message");
                }
            };

            const handleStatusChange = async (newStatus) => {
                try {
                    await updateContactStatus(contact.id, newStatus);
                    toast.success(`Marked as ${newStatus}`);
                    router.refresh();
                } catch {
                    toast.error("Failed to update status");
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
                    <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                        <DropdownMenuLabel className="text-zinc-400">Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push(`/admin/messages/${contact.id}`)} className="gap-2">
                            <Eye className="w-3.5 h-3.5" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(contact.email)} className="gap-2">
                            <Mail className="w-3.5 h-3.5" /> Copy Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem onClick={() => handleStatusChange("responded")} className="text-emerald-400 gap-2">
                            Mark Responded
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange("archived")} className="text-zinc-400 gap-2">
                            Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange("spam")} className="text-orange-400 gap-2">
                            Mark Spam
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem onClick={handleDelete} className="text-red-500 focus:text-red-500 gap-2">
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
