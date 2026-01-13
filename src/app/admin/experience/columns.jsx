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
import { deleteExperience } from "@/actions/experience"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export const columns = [
    {
        accessorKey: "company",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-zinc-900 text-zinc-400 hover:text-white"
                >
                    Company
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium text-white">{row.getValue("company")}</div>
    },
    {
        accessorKey: "position",
        header: "Position",
        cell: ({ row }) => <div className="text-zinc-300">{row.getValue("position")}</div>,
    },
    {
        accessorKey: "startDate",
        header: "Date Range",
        cell: ({ row }) => {
            const start = new Date(row.original.startDate).toLocaleDateString();
            const end = row.original.endDate ? new Date(row.original.endDate).toLocaleDateString() : "Present";
            return <div className="text-zinc-500 text-sm">{start} - {end}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const exp = row.original
            const router = useRouter()

            const handleDelete = async () => {
                if (confirm("Are you sure you want to delete this experience?")) {
                    const res = await deleteExperience(exp.id);
                    if (res.success) {
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
                            onClick={() => navigator.clipboard.writeText(exp.id)}
                            className="text-zinc-300 focus:bg-zinc-900 focus:text-white"
                        >
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <Link href={`/admin/experience/${exp.id}`}>
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
