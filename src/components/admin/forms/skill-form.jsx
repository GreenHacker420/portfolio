"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createSkill, updateSkill } from "@/actions/skills"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
    name: z.string().min(1, "Name is required."),
    category: z.string().default("frontend"),
    level: z.coerce.number().min(0).max(100).default(50),
    description: z.string().optional(),
    icon: z.string().optional(),
    isVisible: z.boolean().default(true),
    displayOrder: z.coerce.number().default(0),
})

export function SkillForm({ initialData }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const defaultValues = initialData || {
        name: "",
        category: "frontend",
        level: 50,
        description: "",
        icon: "",
        isVisible: true,
        displayOrder: 0,
    }

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues,
    })

    async function onSubmit(values) {
        setIsLoading(true)
        try {
            let res;
            if (initialData) {
                res = await updateSkill(initialData.id, values);
            } else {
                res = await createSkill(values);
            }

            if (res.success) {
                router.push('/admin/skills');
                router.refresh();
            } else {
                // Basic alert for now
                alert("Error: " + res.error);
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">

                <div className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800 space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Skill Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="React, Node.js, etc." {...field} className="bg-zinc-950 border-zinc-800" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-zinc-950 border-zinc-800 capitalize">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="frontend">Frontend</SelectItem>
                                            <SelectItem value="backend">Backend</SelectItem>
                                            <SelectItem value="database">Database</SelectItem>
                                            <SelectItem value="devops">DevOps</SelectItem>
                                            <SelectItem value="design">Design</SelectItem>
                                            <SelectItem value="tools">Tools</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Proficiency (%)</FormLabel>
                                    <FormControl>
                                        <Input type="number" min="0" max="100" {...field} className="bg-zinc-950 border-zinc-800" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="icon"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Icon Slug (SimpleIcons)</FormLabel>
                                <FormControl>
                                    <Input placeholder="react, nodedotjs" {...field} className="bg-zinc-950 border-zinc-800" />
                                </FormControl>
                                <FormDescription className="text-xs">
                                    Slug used for the 3D cloud.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isVisible"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-800 p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Visible</FormLabel>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Skill" : "Add Skill"}
                </Button>
            </form>
        </Form>
    )
}
