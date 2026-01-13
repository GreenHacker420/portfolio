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
import { useTransition } from "react";
import { createFAQ, updateFAQ } from "@/actions/faqs";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    question: z.string().min(2, "Question is required"),
    answer: z.string().min(2, "Answer is required"),
    category: z.string().min(1, "Category is required"),
    isVisible: z.boolean().default(true),
});

export default function FAQForm({ initialData }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const defaultValues = initialData || {
        question: "",
        answer: "",
        category: "General",
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
                    await updateFAQ(initialData.id, values);
                    toast.success("FAQ updated");
                } else {
                    await createFAQ(values);
                    toast.success("FAQ created");
                }
                router.push("/admin/faqs");
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
                                    name="question"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Question</FormLabel>
                                            <FormControl>
                                                <Input placeholder="What is your hourly rate?" {...field} className="bg-zinc-950 border-zinc-800" value={field.value || ""} />
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
                                            <FormControl>
                                                <Input placeholder="General, Tech, etc." {...field} className="bg-zinc-950 border-zinc-800" value={field.value || ""} />
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
                                    name="answer"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Answer</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Markdown supported..." className="min-h-[150px] bg-zinc-950 border-zinc-800" {...field} value={field.value || ""} />
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
                                                    Show this FAQ on your portfolio
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
                    {initialData ? "Update FAQ" : "Create FAQ"}
                </Button>
            </form>
        </Form>
    );
}
