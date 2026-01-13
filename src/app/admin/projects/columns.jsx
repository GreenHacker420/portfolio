"use client"

import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteProject } from "@/actions/projects"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { toast } from "sonner" // Assuming sonner or toast is available? Shadcn uses sonner or toast. I'll check.
// If toast is missing, I'll validte. But for now I'll just use window.confirm properly.

export const columns = [
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-zinc-900 text-zinc-400 hover:text-white"
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium text-white">{row.getValue("title")}</div>
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => <Badge variant="outline" className="border-zinc-700 text-zinc-400 capitalize">{row.getValue("category")}</Badge>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status")
            const colors = {
                published: "border-emerald-500/50 text-emerald-400 bg-emerald-500/10",
                draft: "border-zinc-700 text-zinc-400 bg-zinc-800/50",
                archived: "border-orange-500/50 text-orange-400 bg-orange-500/10"
            }
            return <Badge variant="outline" className={colors[status] || colors.draft}>{status}</Badge>
        },
    },
    {
        accessorKey: "viewCount",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-zinc-900 text-zinc-400 hover:text-white"
                >
                    Views
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="text-zinc-500 text-center">{row.getValue("viewCount")}</div>,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const project = row.original
            const router = useRouter()

            const handleDelete = async () => {
                if (confirm("Are you sure you want to delete this project?")) {
                    const res = await deleteProject(project.id);
                    if (res.success) {
                        // toast?
                        router.refresh();
                    } else {
                        alert(res.error);
                    }
                }
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-900 text-zinc-400">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800">
                        <DropdownMenuLabel className="text-zinc-400">Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(project.id)}
                            className="text-zinc-300 focus:bg-zinc-900 focus:text-white"
                        >
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <Link href={`/admin/projects/${project.id}`}>
                            <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-900 focus:text-white">
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                            onClick={handleDelete}
                            className="text-red-400 focus:bg-red-500/10 focus:text-red-300"
                        >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
