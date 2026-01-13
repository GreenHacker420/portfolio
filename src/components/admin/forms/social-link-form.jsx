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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createSocialLink, updateSocialLink } from "@/actions/social-links";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    platform: z.string().min(2, "Platform is required"),
    username: z.string().min(1, "Username is required"),
    url: z.string().url("Must be a valid URL"),
    icon: z.string().optional(),
    isVisible: z.boolean().default(true),
});

export default function SocialLinkForm({ initialData }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const defaultValues = initialData || {
        platform: "",
        username: "",
        url: "",
        icon: "",
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
                    await updateSocialLink(initialData.id, values);
                    toast.success("Link updated");
                } else {
                    await createSocialLink(values);
                    toast.success("Link created");
                }
                router.push("/admin/social-links");
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
                                    name="platform"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Platform</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Twitter" {...field} className="bg-zinc-950 border-zinc-800" value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="@username" {...field} className="bg-zinc-950 border-zinc-800" value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://twitter.com/..." {...field} className="bg-zinc-950 border-zinc-800" value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="icon"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Icon (SimpleIcons slug)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="twitter" {...field} className="bg-zinc-950 border-zinc-800" value={field.value || ""} />
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
                                                    Show this link on your portfolio
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
                    {initialData ? "Update Link" : "Create Link"}
                </Button>
            </form>
        </Form>
    );
}
