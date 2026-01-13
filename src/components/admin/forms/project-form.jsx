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
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createProject, updateProject } from "@/actions/projects"
import { ArrayInput } from "@/components/admin/array-input"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    category: z.string().default("Web App"),
    status: z.enum(["draft", "published", "archived"]).default("draft"),
    techStack: z.array(z.string()).default([]),
    repoUrl: z.string().optional(),
    projectUrl: z.string().optional(),
    imageUrl: z.string().optional(),
    featured: z.boolean().default(false),
    isVisible: z.boolean().default(true),
    displayOrder: z.coerce.number().default(0),
    // JSON fields handling as arrays of strings for simplicity
    highlights: z.array(z.string()).optional().default([]),
    learnings: z.array(z.string()).optional().default([]),
    challenges: z.array(z.string()).optional().default([]),
})

export function ProjectForm({ initialData }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    // Parse JSON fields if they are strings (from DB)
    const safeParse = (data) => {
        if (typeof data === 'string') {
            try { return JSON.parse(data) } catch { return [] }
        }
        return Array.isArray(data) ? data : []
    }

    const defaultValues = initialData ? {
        ...initialData,
        techStack: safeParse(initialData.techStack),
        highlights: safeParse(initialData.highlights),
        learnings: safeParse(initialData.learnings),
        challenges: safeParse(initialData.challenges),
    } : {
        title: "",
        description: "",
        category: "Web App",
        status: "draft",
        techStack: [],
        repoUrl: "",
        projectUrl: "",
        imageUrl: "",
        featured: false,
        isVisible: true,
        displayOrder: 0,
        highlights: [],
        learnings: [],
        challenges: [],
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
                res = await updateProject(initialData.id, values);
            } else {
                res = await createProject(values);
            }

            if (res.success) {
                router.push('/admin/projects');
                router.refresh();
            } else {
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800 space-y-4">
                            <h3 className="text-lg font-medium text-emerald-500">Core Information</h3>
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Portfolio v3" {...field} className="bg-zinc-950 border-zinc-800" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-950 border-zinc-800">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Web App">Web App</SelectItem>
                                                <SelectItem value="Mobile App">Mobile App</SelectItem>
                                                <SelectItem value="API / Backend">API / Backend</SelectItem>
                                                <SelectItem value="Library">Library</SelectItem>
                                                <SelectItem value="Design">Design</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Short Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="A brief summary..."
                                                className="bg-zinc-950 border-zinc-800 min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800 space-y-4">
                            <h3 className="text-lg font-medium text-blue-400">Links & Assets</h3>
                            <FormField
                                control={form.control}
                                name="repoUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>GitHub Repo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://github.com/..." {...field} className="bg-zinc-950 border-zinc-800" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="projectUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Live URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://..." {...field} className="bg-zinc-950 border-zinc-800" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cover Image URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="/projects/cover.jpg" {...field} className="bg-zinc-950 border-zinc-800" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800 space-y-4">
                            <h3 className="text-lg font-medium text-violet-400">Technical Details</h3>
                            <FormField
                                control={form.control}
                                name="techStack"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tech Stack</FormLabel>
                                        <FormControl>
                                            <ArrayInput value={field.value} onChange={field.onChange} placeholder="Add technology (e.g. React)..." />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="highlights"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Key Highlights</FormLabel>
                                        <FormControl>
                                            <ArrayInput value={field.value} onChange={field.onChange} placeholder="Add highlight..." />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800 space-y-4">
                            <h3 className="text-lg font-medium text-orange-400">Configuration</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-zinc-950 border-zinc-800">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="draft">Draft</SelectItem>
                                                    <SelectItem value="published">Published</SelectItem>
                                                    <SelectItem value="archived">Archived</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="displayOrder"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Order</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} className="bg-zinc-950 border-zinc-800" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="featured"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-800 p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Featured Project</FormLabel>
                                            <FormDescription>
                                                Display on the homepage?
                                            </FormDescription>
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
                            <FormField
                                control={form.control}
                                name="isVisible"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-800 p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Visible</FormLabel>
                                            <FormDescription>
                                                Show publicly?
                                            </FormDescription>
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
                    </div>
                </div>

                <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 w-full md:w-auto">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Project" : "Create Project"}
                </Button>
            </form>
        </Form>
    )
}
