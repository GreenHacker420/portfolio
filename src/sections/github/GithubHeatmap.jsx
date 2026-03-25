"use client";
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, GitFork, ArrowUpRight } from "lucide-react";
import { BodyPortal } from "./utils";

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

const getColor = (count) => {
    if (count >= 8) return "#39ff14";
    if (count >= 4) return "#22c55e";
    if (count >= 2) return "#15803d";
    if (count >= 1) return "#14532d";
    return "#161b22";
};

const formatTooltipDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};

export const GithubHeatmap = ({ data, total }) => {
    if (!data || data.length === 0) return null;

    const [tooltip, setTooltip] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);

    const weeks = useMemo(() => {
        const w = [];
        for (let i = 0; i < data.length; i += 7) {
            w.push(data.slice(i, i + 7));
        }
        return w;
    }, [data]);

    const handleMouseEnter = (e, day) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
            x: rect.left + rect.width / 2,
            y: rect.top,
            count: day.count,
            date: day.date
        });
    };

    return (
        <div className="bg-neutral-900/50 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        Consistency Graph
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">Daily contribution frequency over the past year</p>
                </div>
                <div className="flex items-center gap-3 bg-black/20 p-2 rounded-xl border border-white/5">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-tighter">Less</span>
                    {[0, 2, 5, 10].map(c => (
                        <div key={c} className="w-3 h-3 rounded-sm" style={{ backgroundColor: getColor(c) }} />
                    ))}
                    <span className="text-[10px] text-neutral-500 uppercase tracking-tighter">More</span>
                </div>
            </div>

            <div className="overflow-x-auto pb-4 scrollbar-hide">
                <div className="min-w-[700px] flex gap-1.5">
                    <div className="grid grid-rows-7 gap-1 mt-6 mr-2">
                        {DAY_LABELS.map((label, i) => (
                            <span key={i} className="text-[9px] text-neutral-600 h-3 flex items-center">{label}</span>
                        ))}
                    </div>

                    <div className="flex-1 flex gap-1">
                        {weeks.map((week, wi) => (
                            <div key={wi} className="flex flex-col gap-1">
                                {wi % 4 === 0 && (
                                    <span className="text-[9px] text-neutral-600 mb-1 h-3">
                                        {MONTH_LABELS[new Date(week[0].date).getMonth()]}
                                    </span>
                                )}
                                {wi % 4 !== 0 && <div className="h-3 mb-1" />}
                                {week.map((day, di) => (
                                    <motion.div
                                        key={day.date}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: (wi * 7 + di) * 0.001 }}
                                        className={`w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-neon-green/50 hover:z-10 ${selectedDay?.date === day.date ? 'ring-2 ring-white scale-110' : ''}`}
                                        style={{ backgroundColor: getColor(day.count) }}
                                        onMouseEnter={(e) => handleMouseEnter(e, day)}
                                        onMouseLeave={() => setTooltip(null)}
                                        onClick={() => setSelectedDay(day)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {selectedDay && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 rounded-2xl bg-white/[2%] border border-white/5"
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-neutral-400">{formatTooltipDate(selectedDay.date)}</span>
                        <span className="text-xs text-neon-green font-mono">{selectedDay.count} contributions</span>
                    </div>
                    {selectedDay.activities && selectedDay.activities.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {selectedDay.activities.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-black/20 border border-white/5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-neon-green/50" />
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-white font-medium truncate">{item.message}</p>
                                        <p className="text-xs text-neutral-400 truncate flex items-center gap-1 mt-0.5">
                                            {item.isPrivate ? <MapPin className="w-3 h-3" /> : <GitFork className="w-3 h-3" />}
                                            {item.repo}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-xs text-neutral-500 py-2">No detailed data available for this day.</div>
                    )}
                </motion.div>
            )}

            <div className="mt-4 flex justify-between items-center text-xs text-neutral-500 border-t border-white/5 pt-4">
                <span>{(total || 0).toLocaleString()} contributions in the last year</span>
                <a href="https://github.com/GreenHacker420" target="_blank" rel="noopener noreferrer" className="hover:text-neon-green transition-colors flex items-center gap-1">
                    Learn more on GitHub <ArrowUpRight className="w-3 h-3" />
                </a>
            </div>

            {tooltip && (
                <BodyPortal>
                    <div
                        className="fixed z-[9999] pointer-events-none bg-zinc-800/95 text-white text-xs py-2.5 px-3.5 rounded-xl shadow-2xl border border-white/10 whitespace-nowrap backdrop-blur-sm"
                        style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -120%)' }}
                    >
                        <strong className="block text-neon-green text-[13px] mb-0.5">
                            {tooltip.count} contribution{tooltip.count !== 1 ? 's' : ''}
                        </strong>
                        <span className="text-zinc-400 text-[11px]">{formatTooltipDate(tooltip.date)}</span>
                        <div className="text-[10px] text-zinc-500 mt-1 italic">Click to view details</div>
                        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-zinc-800/95" />
                    </div>
                </BodyPortal>
            )}
        </div>
    );
};
