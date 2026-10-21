"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Monitor, ImageIcon, Loader2, Globe, Github } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useOutsideClick } from "@/hooks/use-outside-click";
import Tilt3D from "@/components/ui/Tilt3D";

// ── Sub-component: handles the preview area (image ↔ live-iframe toggle) ──
function ActiveCardPreview({ active, id }) {
    const hasLiveUrl = Boolean(active?.projectUrl);
    const [mode, setMode] = useState(hasLiveUrl ? "iframe" : "image");
    const [iframeLoading, setIframeLoading] = useState(true);

    // Default to iframe mode if projectUrl exists, else image mode
    useEffect(() => {
        setMode(Boolean(active?.projectUrl) ? "iframe" : "image");
        setIframeLoading(true);
    }, [active?.id, active?.projectUrl]);

    return (
        <motion.div
            layoutId={`image-${active.id}-${id}`}
            className="relative w-full h-64 md:h-80 bg-neutral-950"
        >
            {/* Toggle row — only visible when there IS a live URL */}
            {hasLiveUrl && (
                <div className="absolute top-3 right-3 z-30 flex items-center gap-1 bg-black/70 backdrop-blur-md rounded-full p-1 border border-white/10">
                    <button
                        onClick={() => setMode("image")}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
                            mode === "image"
                                ? "bg-white text-black"
                                : "text-neutral-400 hover:text-white"
                        )}
                    >
                        <ImageIcon className="w-3 h-3" />
                        Screenshot
                    </button>
                    <button
                        onClick={() => { setMode("iframe"); setIframeLoading(true); }}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
                            mode === "iframe"
                                ? "bg-emerald-500 text-black"
                                : "text-neutral-400 hover:text-white"
                        )}
                    >
                        <Monitor className="w-3 h-3" />
                        Live Preview
                    </button>
                </div>
            )}

            {/* Screenshot mode */}
            {mode === "image" && (
                <Image
                    priority
                    fill
                    src={active.src}
                    alt={active.title}
                    className="w-full h-full object-cover sm:rounded-tl-2xl sm:rounded-tr-2xl"
                />
            )}

            {/* Live iframe mode */}
            {mode === "iframe" && (
                <div className="relative w-full h-full overflow-hidden sm:rounded-tl-2xl sm:rounded-tr-2xl bg-neutral-950">
                    {/* Loading spinner */}
                    {iframeLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-950 z-20">
                            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                            <span className="text-xs text-neutral-400 font-mono">Loading live preview…</span>
                            <span className="text-[10px] text-neutral-500 font-mono max-w-[80%] truncate">{active.projectUrl}</span>
                        </div>
                    )}
                    <iframe
                        src={active.projectUrl}
                        title={"Live preview of " + active.title}
                        className="w-full h-full border-0"
                        style={{ transform: "scale(0.75)", transformOrigin: "top left", width: "133.33%", height: "133.33%" }}
                        onLoad={() => setIframeLoading(false)}
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    />
                    {/* Bottom floating bar with site link and embed note */}
                    <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
                        <a
                            href={active.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/85 border border-white/15 text-xs text-emerald-400 font-mono hover:bg-black hover:border-emerald-500/40 transition-all backdrop-blur-sm shadow-lg"
                        >
                            <Globe className="w-3.5 h-3.5 text-emerald-400" />
                            Open in new tab ↗
                        </a>
                        <span className="hidden sm:inline-block text-[10px] text-neutral-400 font-mono bg-black/70 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                            Live Interactive View
                        </span>
                    </div>
                </div>
            )}
        </motion.div>
    );
}

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
                            key={"button-" + active.id + "-" + id}
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
                            layoutId={"card-" + active.id + "-" + id}
                            ref={ref}
                            className="w-full max-w-3xl lg:max-w-4xl max-h-[85vh] h-full md:h-fit md:max-h-[90vh] flex flex-col bg-neutral-900 border border-white/10 sm:rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <ActiveCardPreview active={active} id={id} />

                            <div className="relative">
                                <div className="flex justify-between items-start p-6 bg-neutral-900 border-b border-white/5">
                                    <div className="flex flex-col">
                                        <motion.h3
                                            layoutId={"title-" + active.id + "-" + id}
                                            className="font-bold text-2xl md:text-3xl text-white tracking-tight"
                                        >
                                            {active.title}
                                        </motion.h3>
                                        <motion.p
                                            layoutId={"description-" + active.id + "-" + id}
                                            className="text-neutral-400 text-sm md:text-base mt-1"
                                        >
                                            {active.description}
                                        </motion.p>
                                    </div>

                                    <div className="hidden lg:flex gap-3">
                                        {active.projectUrl && (
                                            <motion.a
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                href={active.projectUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-full font-bold bg-emerald-500 text-black hover:bg-emerald-400 transition-colors"
                                            >
                                                <Globe className="w-4 h-4" />
                                                Live Site
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
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-full font-bold bg-white/10 text-white hover:bg-white/20 transition-colors"
                                            >
                                                <Github className="w-4 h-4" />
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

                                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-neutral-900/80 backdrop-blur-xl lg:hidden flex justify-between gap-3">
                                    {active.repoUrl && (
                                        <a
                                            href={active.repoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm rounded-xl font-bold bg-white/10 text-white"
                                        >
                                            <Github className="w-4 h-4" />
                                            Source
                                        </a>
                                    )}
                                    {active.projectUrl && (
                                        <a
                                            href={active.projectUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm rounded-xl font-bold bg-emerald-500 text-black"
                                        >
                                            <Globe className="w-4 h-4" />
                                            Live Site
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
                            layoutId={"card-" + card.id + "-" + id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: index * 0.12, duration: 0.5, ease: "easeOut" }}
                            onClick={() => setActive(card)}
                            className="relative w-full h-full flex flex-col items-center justify-between bg-neutral-900/40 hover:bg-neutral-800/60 backdrop-blur-xl rounded-[2rem] cursor-pointer border border-white/5 hover:border-neon-green/20 transition-all duration-500 overflow-hidden group shadow-2xl"
                        >
                            <motion.div layoutId={"image-" + card.id + "-" + id} className="relative w-full h-full rounded-[2rem] overflow-hidden z-10 bg-neutral-950">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/15 z-10 transition-opacity duration-500 group-hover:from-black/95 group-hover:via-black/55 pointer-events-none" />

                                {card.projectUrl ? (
                                    <>
                                        {/* Live Website Preview Iframe */}
                                        <div className="absolute inset-0 w-full h-full overflow-hidden bg-neutral-950 pointer-events-none">
                                            <iframe
                                                src={card.projectUrl}
                                                title={"Live preview of " + card.title}
                                                className="border-0 pointer-events-none select-none transition-transform duration-700 ease-out group-hover:scale-[0.42] bg-neutral-950"
                                                style={{
                                                    transform: "scale(0.4)",
                                                    transformOrigin: "top left",
                                                    width: "250%",
                                                    height: "250%",
                                                    pointerEvents: "none"
                                                }}
                                                loading="lazy"
                                                sandbox="allow-scripts allow-same-origin allow-forms"
                                            />
                                        </div>

                                        {/* Live indicator badge */}
                                        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 border border-emerald-500/40 backdrop-blur-md text-[11px] font-mono text-emerald-400 shadow-xl pointer-events-none">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                            LIVE
                                        </div>
                                    </>
                                ) : (
                                    <Image
                                        fill
                                        src={card.src}
                                        alt={card.title}
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                )}

                                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex flex-col translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                    <motion.h3
                                        layoutId={"title-" + card.id + "-" + id}
                                        className="font-bold text-2xl sm:text-3xl text-white text-left tracking-tight group-hover:text-neon-green transition-colors duration-300"
                                    >
                                        {card.title}
                                    </motion.h3>
                                    <motion.p
                                        layoutId={"description-" + card.id + "-" + id}
                                        className="text-neutral-300 text-left mt-2 text-sm sm:text-base line-clamp-2 text-white/70 font-medium"
                                    >
                                        {card.description}
                                    </motion.p>
                                    {/* Tech Stack Pills */}
                                    {card.techStack && card.techStack.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-3 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                            {card.techStack.slice(0, 5).map((tech, ti) => (
                                                <span
                                                    key={ti}
                                                    className="px-2 py-1 text-[10px] font-medium rounded-full bg-white/10 text-white/80 border border-white/10 backdrop-blur-sm"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                            {card.techStack.length > 5 && (
                                                <span className="px-2 py-1 text-[10px] font-medium rounded-full bg-neon-green/10 text-neon-green/70 border border-neon-green/20">
                                                    +{card.techStack.length - 5}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    </Tilt3D>
                ))}
            </ul>
        </>
    );
}
