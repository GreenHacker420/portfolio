"use client";

import React, { useState } from "react";
import { ExternalLink, RefreshCw, Shield, Smartphone, Monitor, Globe, Sparkles } from "lucide-react";

export function LivePreviewFrame({
    url,
    title,
    fallbackImage,
    category = "web",
    allowLiveIframe = true,
    className = ""
}) {
    const [viewMode, setViewMode] = useState(url && allowLiveIframe ? "live" : "preview");
    const [isLoading, setIsLoading] = useState(true);
    const [iframeFailed, setIframeFailed] = useState(false);
    const [deviceView, setDeviceView] = useState("desktop");

    const hasLiveUrl = Boolean(url && url.startsWith("http"));

    const handleReload = () => {
        setIsLoading(true);
        setIframeFailed(false);
        const iframe = document.getElementById(`live-frame-${title.replace(/\s+/g, "-")}`);
        if (iframe) {
            iframe.src = iframe.src;
        }
    };

    return (
        <div className={`w-full rounded-2xl overflow-hidden border border-white/10 bg-neutral-950 shadow-2xl flex flex-col ${className}`}>
            {/* Browser / Device Chrome Header */}
            <div className="bg-neutral-900/90 border-b border-white/10 px-4 py-2.5 flex items-center justify-between gap-3 backdrop-blur-md">
                {/* Traffic lights */}
                <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block border border-red-600/50"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block border border-yellow-600/50"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block border border-emerald-600/50"></span>
                </div>

                {/* URL Bar */}
                <div className="flex-1 max-w-md mx-auto flex items-center justify-center">
                    <div className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-1 flex items-center justify-between gap-2 text-xs font-mono text-neutral-400">
                        <div className="flex items-center gap-1.5 truncate">
                            <Shield className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="text-neutral-300 truncate">
                                {hasLiveUrl ? url.replace(/^https?:\/\//, '') : `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.local`}
                            </span>
                        </div>
                        {hasLiveUrl && (
                            <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                LIVE
                            </span>
                        )}
                    </div>
                </div>

                {/* View Controls */}
                <div className="flex items-center gap-2 shrink-0">
                    {hasLiveUrl && (
                        <div className="hidden sm:flex items-center bg-black/40 border border-white/10 rounded-lg p-0.5 text-xs font-mono">
                            <button
                                type="button"
                                onClick={() => setViewMode("live")}
                                className={`px-2.5 py-1 rounded-md transition-all ${
                                    viewMode === "live"
                                        ? "bg-emerald-500 text-black font-semibold shadow-sm"
                                        : "text-neutral-400 hover:text-white"
                                }`}
                            >
                                Live
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("preview")}
                                className={`px-2.5 py-1 rounded-md transition-all ${
                                    viewMode === "preview"
                                        ? "bg-white/20 text-white font-semibold"
                                        : "text-neutral-400 hover:text-white"
                                }`}
                            >
                                Snapshot
                            </button>
                        </div>
                    )}

                    {hasLiveUrl && viewMode === "live" && (
                        <button
                            type="button"
                            onClick={handleReload}
                            aria-label="Reload Preview"
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
                        </button>
                    )}

                    {hasLiveUrl && (
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Open in new window"
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    )}
                </div>
            </div>

            {/* Viewport Area */}
            <div className="relative w-full aspect-video md:aspect-[16/10] bg-neutral-950 overflow-hidden flex items-center justify-center">
                {hasLiveUrl && viewMode === "live" && !iframeFailed ? (
                    <>
                        {isLoading && (
                            <div className="absolute inset-0 z-10 bg-neutral-950 flex flex-col items-center justify-center gap-3">
                                <div className="h-8 w-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin"></div>
                                <span className="text-xs font-mono text-neutral-400 flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                                    Loading live preview of {title}...
                                </span>
                            </div>
                        )}
                        <iframe
                            id={`live-frame-${title.replace(/\s+/g, "-")}`}
                            src={url}
                            title={`${title} Live Preview`}
                            className="w-full h-full border-0 bg-neutral-950 transition-opacity duration-500"
                            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                            loading="lazy"
                            onLoad={() => setIsLoading(false)}
                            onError={() => {
                                setIframeFailed(true);
                                setIsLoading(false);
                            }}
                        />
                    </>
                ) : (
                    /* High-Res Snapshot View */
                    <div className="relative w-full h-full group">
                        {fallbackImage ? (
                            <img
                                src={fallbackImage}
                                alt={title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-950/40 via-neutral-900 to-black p-8 text-center">
                                <Globe className="w-12 h-12 text-emerald-400/40 mb-3" />
                                <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
                                <p className="text-neutral-400 text-sm max-w-sm font-mono">
                                    {hasLiveUrl ? "Preview loaded from secure snapshot" : "Production Platform Demonstration"}
                                </p>
                            </div>
                        )}

                        {hasLiveUrl && (
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs font-mono flex items-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                                >
                                    <span>Launch Live App</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setViewMode("live")}
                                    className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-2 backdrop-blur-md border border-white/20 transition-all"
                                >
                                    <span>Embed Live Iframe</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
