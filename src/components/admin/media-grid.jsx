"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash, Copy, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createMedia, deleteMedia } from "@/actions/media";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function MediaGrid({ initialData }) {
    const [media, setMedia] = useState(initialData);
    const [isPending, startTransition] = useTransition();
    const [newMediaUrl, setNewMediaUrl] = useState("");
    const [newMediaName, setNewMediaName] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleAddMedia = () => {
        if (!newMediaUrl || !newMediaName) {
            toast.error("Please provide both name and URL");
            return;
        }

        startTransition(async () => {
            const result = await createMedia({
                filename: newMediaName,
                originalName: newMediaName,
                mimeType: "image/unknown", // Simplified
                size: 0,
                url: newMediaUrl,
                category: "gallery",
                isPublic: true
            });

            if (result.success) {
                toast.success("Media added");
                setIsOpen(false);
                setNewMediaUrl("");
                setNewMediaName("");
                // Ideally refresh server data, but we'll simple reload for now or optimistic update
                window.location.reload();
            } else {
                toast.error("Failed to add media");
            }
        });
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure?")) {
            startTransition(async () => {
                const result = await deleteMedia(id);
                if (result.success) {
                    toast.success("Media deleted");
                    setMedia(prev => prev.filter(m => m.id !== id));
                } else {
                    toast.error("Failed to delete media");
                }
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-white text-black hover:bg-zinc-200">
                            <Plus className="mr-2 h-4 w-4" /> Add Media via URL
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
                        <DialogHeader>
                            <DialogTitle>Add New Media</DialogTitle>
                            <DialogDescription>
                                Enter the URL of the image you want to add to your library.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    value={newMediaName}
                                    onChange={(e) => setNewMediaName(e.target.value)}
                                    placeholder="My Image"
                                    className="col-span-3 bg-zinc-900 border-zinc-700"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="url" className="text-right">
                                    URL
                                </Label>
                                <Input
                                    id="url"
                                    value={newMediaUrl}
                                    onChange={(e) => setNewMediaUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="col-span-3 bg-zinc-900 border-zinc-700"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsOpen(false)} className="border-zinc-700 text-zinc-300">
                                Cancel
                            </Button>
                            <Button onClick={handleAddMedia} disabled={isPending} className="bg-white text-black hover:bg-zinc-200">
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Add
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {media.length === 0 && (
                    <div className="col-span-full text-center text-zinc-500 py-10">
                        No media items found.
                    </div>
                )}
                {media.map((item) => (
                    <Card key={item.id} className="bg-zinc-900 border-zinc-800 overflow-hidden group relative">
                        <div className="aspect-square relative flex items-center justify-center bg-zinc-950">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={item.url}
                                alt={item.filename}
                                className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://placehold.co/400?text=Error";
                                }}
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => {
                                        navigator.clipboard.writeText(item.url);
                                        toast.success("URL copied");
                                    }}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <CardContent className="p-3">
                            <p className="text-sm font-medium truncate text-zinc-200">{item.filename}</p>
                            <p className="text-xs text-zinc-500 truncate">{new Date(item.createdAt).toLocaleDateString()}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
