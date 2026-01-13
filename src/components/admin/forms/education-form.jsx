"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createEducation, updateEducation } from "@/actions/education";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    institution: z.string().min(2, "Institution name is required"),
    degree: z.string().min(2, "Degree is required"),
    fieldOfStudy: z.string().optional(),
    location: z.string().optional(),
    startDate: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', {
        message: "Valid start date is required",
    }),
    endDate: z.string().optional().refine((date) => !date || new Date(date).toString() !== 'Invalid Date', {
        message: "Valid end date is required",
    }),
    grade: z.string().optional(),
    activities: z.string().optional(),
    description: z.string().optional(),
    isVisible: z.boolean().default(true),
});

export default function EducationForm({ initialData }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const defaultValues = initialData ? {
        ...initialData,
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        fieldOfStudy: initialData.fieldOfStudy || "",
        location: initialData.location || "",
        grade: initialData.grade || "",
        activities: initialData.activities || "",
        description: initialData.description || "",
    } : {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        location: "",
        startDate: "",
        endDate: "",
        grade: "",
        activities: "",
        description: "",
        isVisible: true,
    };

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    function onSubmit(values) {
        startTransition(async () => {
            try {
                if (initialData) {
                    await updateEducation(initialData.id, values);
                    toast.success("Education updated");
                } else {
                    await createEducation(values);
                    toast.success("Education created");
                }
                router.push("/admin/education");
                router.refresh();
            } catch (error) {
                toast.error("Something went wrong");
                console.error(error);
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
                            <CardContent className="pt-6 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="institution"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Institution</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Harvard University" {...field} className="bg-zinc-950 border-zinc-800" value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="degree"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Degree</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Bachelor of Science" {...field} className="bg-zinc-950 border-zinc-800" value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="fieldOfStudy"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Field of Study (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Computer Science" {...field} className="bg-zinc-950 border-zinc-800" value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="startDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Start Date</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} className="bg-zinc-950 border-zinc-800" value={field.value || ""} />
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
                                                <FormLabel>End Date (Leave empty if present)</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} className="bg-zinc-950 border-zinc-800" value={field.value || ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Cambridge, MA" {...field} className="bg-zinc-950 border-zinc-800" value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="grade"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Grade/GPA (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="4.0" {...field} className="bg-zinc-950 border-zinc-800" value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
                            <CardContent className="pt-6 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Describe your studies..." className="min-h-[120px] bg-zinc-950 border-zinc-800" {...field} value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="activities"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Activities & Societies</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Computer Club, Chess Club..." className="min-h-[80px] bg-zinc-950 border-zinc-800" {...field} value={field.value || ""} />
                                            </FormControl>
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
                                                <FormLabel className="text-base">Visibility</FormLabel>
                                                <FormDescription>
                                                    Show this education on your portfolio
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
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Button type="submit" disabled={isPending} className="bg-white text-black hover:bg-zinc-200">
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Education" : "Create Education"}
                </Button>
            </form>
        </Form>
    );
}
