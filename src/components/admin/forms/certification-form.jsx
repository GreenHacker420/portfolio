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
import { createCertification, updateCertification } from "@/actions/certifications";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(2, "Name is required"),
    issuer: z.string().min(2, "Issuer is required"),
    issueDate: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', {
        message: "Valid issue date is required",
    }),
    expirationDate: z.string().optional().refine((date) => !date || new Date(date).toString() !== 'Invalid Date', {
        message: "Valid expiration date is required",
    }),
    credentialId: z.string().optional(),
    credentialUrl: z.string().optional(),
    isVisible: z.boolean().default(true),
});

export default function CertificationForm({ initialData }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const defaultValues = initialData ? {
        ...initialData,
        issueDate: initialData.issueDate ? new Date(initialData.issueDate).toISOString().split('T')[0] : '',
        expirationDate: initialData.expirationDate ? new Date(initialData.expirationDate).toISOString().split('T')[0] : '',
        credentialId: initialData.credentialId || "",
        credentialUrl: initialData.credentialUrl || "",
    } : {
        name: "",
        issuer: "",
        issueDate: "",
        expirationDate: "",
        credentialId: "",
        credentialUrl: "",
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
                    await updateCertification(initialData.id, values);
                    toast.success("Certification updated");
                } else {
                    await createCertification(values);
                    toast.success("Certification created");
                }
                router.push("/admin/certifications");
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
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="AWS Certified Solutions Architect" {...field} className="bg-zinc-950 border-zinc-800" value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="issuer"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Issuer</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Amazon Web Services" {...field} className="bg-zinc-950 border-zinc-800" value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="issueDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Issue Date</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} className="bg-zinc-950 border-zinc-800" value={field.value || ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="expirationDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Expiration Date</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} className="bg-zinc-950 border-zinc-800" value={field.value || ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
                            <CardContent className="pt-6 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="credentialId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Credential ID</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Has to be unique" {...field} className="bg-zinc-950 border-zinc-800" value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="credentialUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Credential URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://..." {...field} className="bg-zinc-950 border-zinc-800" value={field.value || ""} />
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
                                                    Show this certification on your portfolio
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
                    {initialData ? "Update Certification" : "Create Certification"}
                </Button>
            </form>
        </Form>
    );
}
