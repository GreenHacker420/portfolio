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
import { deleteSkill } from "@/actions/skills"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export const columns = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-zinc-900 text-zinc-400 hover:text-white"
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium text-white">{row.getValue("name")}</div>
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 capitalize">{row.getValue("category")}</Badge>,
    },
    {
        accessorKey: "level",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-zinc-900 text-zinc-400 hover:text-white"
                >
                    Level (%)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const level = row.getValue("level");
            return (
                <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${level}%` }} />
                    </div>
                    <span className="text-xs text-zinc-500">{level}%</span>
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const skill = row.original
            const router = useRouter()

            const handleDelete = async () => {
                if (confirm("Are you sure you want to delete this skill?")) {
                    const res = await deleteSkill(skill.id);
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
                            onClick={() => navigator.clipboard.writeText(skill.id)}
                            className="text-zinc-300 focus:bg-zinc-900 focus:text-white"
                        >
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <Link href={`/admin/skills/${skill.id}`}>
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
