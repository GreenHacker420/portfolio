"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Card = React.memo(({
    card,
    index,
    hovered,
    setHovered
}) => (
    <Dialog>
        <DialogTrigger asChild>
            <div
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                    "rounded-xl relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full cursor-pointer transition-all duration-300 ease-out",
                    hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
                )}>
                <Image
                    src={card.src}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover absolute inset-0"
                />
                <div
                    className={cn(
                        "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
                        hovered === index ? "opacity-100" : "opacity-0"
                    )}>
                    <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
                        {card.title}
                    </div>
                </div>

                {/* Always visible title gradient for non-hover state */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end py-8 px-4 transition-opacity duration-300",
                    hovered === index ? "opacity-0" : "opacity-100"
                )}>
                    <div className="text-xl md:text-2xl font-medium text-white">
                        {card.title}
                    </div>
                </div>
            </div>
        </DialogTrigger>
        <DialogContent className="max-w-3xl bg-neutral-900 border-neutral-800 text-white overflow-y-auto max-h-[90vh]">
            <DialogHeader>
                <DialogTitle className="text-3xl font-bold">{card.title}</DialogTitle>
                <DialogDescription className="text-neutral-400 mt-2">
                    {card.description}
                </DialogDescription>
            </DialogHeader>
            <div className="mt-6 space-y-6">
                <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
                    <Image
                        src={card.src}
                        alt={card.title}
                        fill
                        className="object-cover"
                    />
                </div>
                {card.longDescription && (
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-2">About the Project</h4>
                        <div className="text-neutral-300 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: card.longDescription }} />
                    </div>
                )}
                {card.techStack && card.techStack.length > 0 && (
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                            {card.techStack.map((tech, i) => (
                                <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs text-neutral-200 border border-white/10">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                <div className="flex gap-4 pt-4">
                    {card.projectUrl && (
                        <a href={card.projectUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-white text-black font-medium rounded-md hover:bg-neutral-200 transition-colors">
                            View Live Project
                        </a>
                    )}
                    {card.repoUrl && (
                        <a href={card.repoUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-white/10 text-white border border-white/20 font-medium rounded-md hover:bg-white/20 transition-colors">
                            View Source Code
                        </a>
                    )}
                </div>
            </div>
        </DialogContent>
    </Dialog>
));

Card.displayName = "Card";

export function FocusCards({ cards }) {
    const [hovered, setHovered] = useState(null);

    if (!cards || cards.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full">
            {cards.map((card, index) => (
                <Card
                    key={card.title + index}
                    card={card}
                    index={index}
                    hovered={hovered}
                    setHovered={setHovered}
                />
            ))}
        </div>
    );
}
