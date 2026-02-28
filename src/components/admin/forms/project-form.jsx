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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
    highlights: z.array(z.string()).optional().default([]),
    learnings: z.array(z.string()).optional().default([]),
    challenges: z.array(z.string()).optional().default([]),
})

export function ProjectForm({ initialData }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-5xl">

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="mb-6 grid w-full grid-cols-2 md:grid-cols-4 bg-zinc-950 border border-zinc-800 p-1 rounded-xl h-auto gap-1">
                        <TabsTrigger value="general" className="rounded-lg py-2.5 data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-400">General Info</TabsTrigger>
                        <TabsTrigger value="media" className="rounded-lg py-2.5 data-[state=active]:bg-zinc-800 data-[state=active]:text-blue-400">Links & Media</TabsTrigger>
                        <TabsTrigger value="tech" className="rounded-lg py-2.5 data-[state=active]:bg-zinc-800 data-[state=active]:text-violet-400">Technical details</TabsTrigger>
                        <TabsTrigger value="settings" className="rounded-lg py-2.5 data-[state=active]:bg-zinc-800 data-[state=active]:text-orange-400">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
                            <div className="h-1 w-full bg-emerald-500/20" />
                            <CardHeader className="pb-4 border-b border-zinc-800/50">
                                <CardTitle className="text-xl text-emerald-400">Core Information</CardTitle>
                                <CardDescription>Basic details about the project that will be shown on cards.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6 bg-zinc-950/20">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Project Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Portfolio v3, Acme Dashboard..." {...field} className="bg-zinc-950 border-zinc-800 h-11 text-base transition-colors focus-visible:ring-emerald-500/30" />
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
                                                    <SelectTrigger className="bg-zinc-950 border-zinc-800 h-11 transition-colors focus:ring-emerald-500/30">
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-zinc-900 border-zinc-800">
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
                                                    placeholder="A brief summary of what the project does..."
                                                    className="bg-zinc-950 border-zinc-800 min-h-[120px] resize-y transition-colors focus-visible:ring-emerald-500/30"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="media" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
                            <div className="h-1 w-full bg-blue-500/20" />
                            <CardHeader className="pb-4 border-b border-zinc-800/50">
                                <CardTitle className="text-xl text-blue-400">Links & Media</CardTitle>
                                <CardDescription>URLs to the live site, github repository, and cover image.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6 bg-zinc-950/20">
                                <FormField
                                    control={form.control}
                                    name="repoUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>GitHub Repo URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://github.com/..." {...field} className="bg-zinc-950 border-zinc-800 h-11 transition-colors focus-visible:ring-blue-500/30" />
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
                                            <FormLabel>Live Site URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://..." {...field} className="bg-zinc-950 border-zinc-800 h-11 transition-colors focus-visible:ring-blue-500/30" />
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
                                            <FormLabel>Cover Image Location</FormLabel>
                                            <FormControl>
                                                <Input placeholder="/projects/cover.jpg" {...field} className="bg-zinc-950 border-zinc-800 h-11 transition-colors focus-visible:ring-blue-500/30" />
                                            </FormControl>
                                            <FormDescription>Relative path or full URL for the project thumbnail.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="tech" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
                            <div className="h-1 w-full bg-violet-500/20" />
                            <CardHeader className="pb-4 border-b border-zinc-800/50">
                                <CardTitle className="text-xl text-violet-400">Technical Details</CardTitle>
                                <CardDescription>Define the tech stack and key technical highlights of the project.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8 pt-6 bg-zinc-950/20">
                                <FormField
                                    control={form.control}
                                    name="techStack"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tech Stack</FormLabel>
                                            <FormControl>
                                                <ArrayInput value={field.value} onChange={field.onChange} placeholder="e.g. Next.js, React, Prisma..." />
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
                                                <ArrayInput value={field.value} onChange={field.onChange} placeholder="Add a major feature..." />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
                            <div className="h-1 w-full bg-orange-500/20" />
                            <CardHeader className="pb-4 border-b border-zinc-800/50">
                                <CardTitle className="text-xl text-orange-400">Configuration</CardTitle>
                                <CardDescription>Set the visibility, status, and ordering of the project.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6 bg-zinc-950/20">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-zinc-950 border-zinc-800 h-11 transition-colors focus:ring-orange-500/30">
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-zinc-900 border-zinc-800">
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
                                                    <Input type="number" {...field} className="bg-zinc-950 border-zinc-800 h-11 transition-colors focus-visible:ring-orange-500/30" />
                                                </FormControl>
                                                <FormDescription>Lower numbers appear first.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-800/50">
                                    <FormField
                                        control={form.control}
                                        name="featured"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:bg-zinc-800/50">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base text-zinc-200">Featured Project</FormLabel>
                                                    <FormDescription>
                                                        Display prominently on homepage
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
                                            <FormItem className="flex flex-row items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:bg-zinc-800/50">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base text-zinc-200">Visible to Public</FormLabel>
                                                    <FormDescription>
                                                        Allow visitors to view this
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
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end pt-8 mt-4 sticky bottom-6 z-10">
                    <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium w-full sm:w-auto min-w-[160px] h-12 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Save Project Details" : "Publish New Project"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
