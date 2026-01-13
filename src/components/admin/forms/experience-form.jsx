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
import { Switch } from "@/components/ui/switch"
import { createExperience, updateExperience } from "@/actions/experience"
import { ArrayInput } from "@/components/admin/array-input"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
    company: z.string().min(1, "Company is required."),
    position: z.string().min(1, "Position is required."),
    location: z.string().optional(),
    startDate: z.string().min(1, "Start date is required."),
    endDate: z.string().optional(), // Empty string = Present
    description: z.string().optional(),
    achievements: z.array(z.string()).default([]),
    technologies: z.array(z.string()).default([]),
    isVisible: z.boolean().default(true),
    displayOrder: z.coerce.number().default(0),
})

export function ExperienceForm({ initialData }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    // Helper to format Date object to YYYY-MM-DD for input
    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toISOString().split('T')[0];
    }

    const safeParse = (data) => {
        if (typeof data === 'string') {
            try { return JSON.parse(data) } catch { return [] }
        }
        return Array.isArray(data) ? data : []
    }

    const defaultValues = initialData ? {
        ...initialData,
        startDate: formatDate(initialData.startDate),
        endDate: initialData.endDate ? formatDate(initialData.endDate) : "",
        achievements: safeParse(initialData.achievements),
        technologies: safeParse(initialData.technologies),
    } : {
        company: "",
        position: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
        achievements: [],
        technologies: [],
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
            // Convert dates back to ISO-8601 DateTime strings if needed by Prisma
            // But Prisma DateTime expects ISO string usually.
            // We pass "2024-01-01" which is valid for ISO date.
            // Actually Prisma needs full ISO usually: "2024-01-01T00:00:00Z"
            // Let's ensure validity.

            const payload = {
                ...values,
                startDate: new Date(values.startDate).toISOString(),
                endDate: values.endDate ? new Date(values.endDate).toISOString() : null,
            }

            let res;
            if (initialData) {
                res = await updateExperience(initialData.id, payload);
            } else {
                res = await createExperience(payload);
            }

            if (res.success) {
                router.push('/admin/experience');
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800 space-y-4">
                            <h3 className="text-lg font-medium text-emerald-500">Role Details</h3>
                            <FormField
                                control={form.control}
                                name="company"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Acme Corp" {...field} className="bg-zinc-950 border-zinc-800" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="position"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Position / Role</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Senior Developer" {...field} className="bg-zinc-950 border-zinc-800" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Remote / City" {...field} className="bg-zinc-950 border-zinc-800" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800 space-y-4">
                            <h3 className="text-lg font-medium text-blue-400">Timeline</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} className="bg-zinc-950 border-zinc-800" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} className="bg-zinc-950 border-zinc-800" />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                Leave empty if currently working.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800 space-y-4">
                            <h3 className="text-lg font-medium text-violet-400">Details</h3>
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Core responsibilities..."
                                                className="bg-zinc-950 border-zinc-800 min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="achievements"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Key Achievements</FormLabel>
                                        <FormControl>
                                            <ArrayInput value={field.value} onChange={field.onChange} placeholder="Add achievement..." />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="technologies"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Technologies Used</FormLabel>
                                        <FormControl>
                                            <ArrayInput value={field.value} onChange={field.onChange} placeholder="Add tech..." />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800 space-y-4">
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
                    </div>
                </div>

                <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 w-full md:w-auto">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Experience" : "Add Experience"}
                </Button>
            </form>
        </Form>
    )
}
