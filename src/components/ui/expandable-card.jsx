"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useOutsideClick } from "@/hooks/use-outside-click";
import Tilt3D from "@/components/ui/Tilt3D";

export function ExpandableCard({ cards, active: externalActive, setActive: setExternalActive }) {
    const [internalActive, setInternalActive] = useState(null);
    const active = externalActive !== undefined ? externalActive : internalActive;
    const setActive = setExternalActive !== undefined ? setExternalActive : setInternalActive;
    const id = useId();
    const ref = useRef(null);

    useEffect(() => {
        function onKeyDown(event) {
            if (event.key === "Escape") {
                setActive(null);
            }
        }

        if (active && typeof active === "object") {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [active]);

    useOutsideClick(ref, () => setActive(null));

    return (
        <>
            <AnimatePresence>
                {active && typeof active === "object" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-[9990] h-full w-full"
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {active && typeof active === "object" ? (
                    <div className="fixed inset-0 grid place-items-center z-[9999] w-full mt-[10vh]">
                        <motion.button
                            key={`button-${active.id}-${id}`}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.05 } }}
                            className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-8 w-8 z-[10000] text-black"
                            onClick={() => setActive(null)}
                        >
                            <X size={20} />
                        </motion.button>
                        <motion.div
                            layoutId={`card-${active.id}-${id}`}
                            ref={ref}
                            className="w-full max-w-3xl lg:max-w-4xl max-h-[85vh] h-full md:h-fit md:max-h-[90vh] flex flex-col bg-neutral-900 border border-white/10 sm:rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <motion.div layoutId={`image-${active.id}-${id}`} className="relative w-full h-64 md:h-80 sm:p-2 bg-neutral-900">
                                <Image
                                    priority
                                    fill
                                    src={active.src}
                                    alt={active.title}
                                    className="w-full h-full object-cover sm:rounded-tl-2xl sm:rounded-tr-2xl"
                                />
                            </motion.div>

                            <div className="relative">
                                <div className="flex justify-between items-start p-6 bg-neutral-900 border-b border-white/5">
                                    <div className="flex flex-col">
                                        <motion.h3
                                            layoutId={`title-${active.id}-${id}`}
                                            className="font-bold text-2xl md:text-3xl text-white tracking-tight"
                                        >
                                            {active.title}
                                        </motion.h3>
                                        <motion.p
                                            layoutId={`description-${active.id}-${id}`}
                                            className="text-neutral-400 text-sm md:text-base mt-1"
                                        >
                                            {active.description}
                                        </motion.p>
                                    </div>

                                    <div className="hidden lg:flex gap-4">
                                        {active.projectUrl && (
                                            <motion.a
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                href={active.projectUrl}
                                                target="_blank"
                                                className="px-6 py-3 text-sm rounded-full font-bold bg-white text-black hover:bg-neutral-200 transition-colors"
                                            >
                                                Live Preview
                                            </motion.a>
                                        )}
                                        {active.repoUrl && (
                                            <motion.a
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                href={active.repoUrl}
                                                target="_blank"
                                                className="px-6 py-3 text-sm rounded-full font-bold bg-white/10 text-white hover:bg-white/20 transition-colors"
                                            >
                                                Source Code
                                            </motion.a>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 md:p-8 pt-4 sm:pt-6 bg-neutral-900 overflow-y-auto max-h-[40vh] md:max-h-[45vh] pb-24 lg:pb-8">
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-neutral-300 sm:text-lg flex flex-col gap-6"
                                    >
                                        {active.longDescription && (
                                            <div>
                                                <h4 className="text-xl font-semibold text-white mb-2 tracking-tight">About</h4>
                                                <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: active.longDescription }} />
                                            </div>
                                        )}

                                        {active.techStack && active.techStack.length > 0 && (
                                            <div>
                                                <h4 className="text-xl font-semibold text-white mb-3 tracking-tight">Technologies used</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {active.techStack.map((tech, i) => (
                                                        <span key={i} className="px-3 py-1.5 bg-neutral-800 rounded-lg text-sm text-neutral-200 border border-white/5">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-neutral-900/80 backdrop-blur-xl lg:hidden flex justify-between gap-4">
                                    {active.repoUrl && (
                                        <a
                                            href={active.repoUrl}
                                            target="_blank"
                                            className="w-full text-center px-4 py-3 text-sm rounded-xl font-bold bg-white/10 text-white"
                                        >
                                            Source Code
                                        </a>
                                    )}
                                    {active.projectUrl && (
                                        <a
                                            href={active.projectUrl}
                                            target="_blank"
                                            className="w-full text-center px-4 py-3 text-sm rounded-xl font-bold bg-white text-black"
                                        >
                                            Live Preview
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : null}
            </AnimatePresence>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 lg:gap-8 gap-6 max-w-5xl mx-auto w-full">
                {cards.map((card, index) => (
                    <Tilt3D key={card.id + index} className="w-full h-[400px]">
                        <motion.div
                            layoutId={`card-${card.id}-${id}`}
                            onClick={() => setActive(card)}
                            className="relative w-full h-full flex flex-col items-center justify-between bg-neutral-900/40 hover:bg-neutral-800/60 backdrop-blur-xl rounded-[2rem] cursor-pointer border border-white/5 transition-all duration-500 overflow-hidden group shadow-2xl"
                        >
                            <motion.div layoutId={`image-${card.id}-${id}`} className="relative w-full h-full rounded-[2rem] overflow-hidden z-10">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 transition-opacity duration-500 group-hover:from-black/95 group-hover:via-black/40" />
                                <Image
                                    fill
                                    src={card.src}
                                    alt={card.title}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex flex-col translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                    <motion.h3
                                        layoutId={`title-${card.id}-${id}`}
                                        className="font-bold text-2xl sm:text-3xl text-white text-left tracking-tight group-hover:text-purple-300 transition-colors duration-300"
                                    >
                                        {card.title}
                                    </motion.h3>
                                    <motion.p
                                        layoutId={`description-${card.id}-${id}`}
                                        className="text-neutral-300 text-left mt-2 text-sm sm:text-base line-clamp-2 text-white/70 font-medium"
                                    >
                                        {card.description}
                                    </motion.p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </Tilt3D>
                ))}
            </ul>
        </>
    );
}
