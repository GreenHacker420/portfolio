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
import { updatePersonalInfo } from "@/actions/personal-info"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner" // Assume sonner/toast usage

const formSchema = z.object({
    fullName: z.string().min(2),
    title: z.string().min(2),
    email: z.string().email(),
    bio: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    website: z.string().optional(),
    githubUsername: z.string().optional(),
    avatar: z.string().optional(),
    resume: z.string().optional(),
    isVisible: z.boolean().default(true),
})

export function PersonalInfoForm({ initialData }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            fullName: "",
            title: "",
            email: "",
            bio: "",
            phone: "",
            location: "",
            website: "",
            avatar: "",
            resume: "",
            isVisible: true,
        },
    })

    async function onSubmit(values) {
        setIsLoading(true)
        try {
            const res = await updatePersonalInfo(values);
            if (res.success) {
                router.refresh();
                alert("Information Updated Successfully"); // Fallback if no toast
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

                <div className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800 space-y-6">
                    <h3 className="text-lg font-medium text-emerald-500">Identity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} className="bg-zinc-950 border-zinc-800" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Professional Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Full Stack Developer" {...field} className="bg-zinc-950 border-zinc-800" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email@example.com" {...field} className="bg-zinc-950 border-zinc-800" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="+1 234 567 890" {...field} className="bg-zinc-950 border-zinc-800" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Biometrics / Bio</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="A little about yourself..." {...field} className="bg-zinc-950 border-zinc-800 min-h-[120px]" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800 space-y-6">
                    <h3 className="text-lg font-medium text-blue-400">Public Presence</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="San Francisco, CA" {...field} className="bg-zinc-950 border-zinc-800" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Personal Website URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} className="bg-zinc-950 border-zinc-800" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="githubUsername"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>GitHub Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="GreenHacker420" {...field} className="bg-zinc-950 border-zinc-800" />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        Used to fetch contribution heatmap and stats.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Avatar URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="/me.jpg" {...field} className="bg-zinc-950 border-zinc-800" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="resume"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Resume URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="/resume.pdf" {...field} className="bg-zinc-950 border-zinc-800" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="isVisible"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-800 p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Public Visibility</FormLabel>
                                    <FormDescription>
                                        Toggle global visibility of your personal info section.
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


                <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 w-full md:w-auto">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </Button>
            </form>
        </Form>
    )
}
