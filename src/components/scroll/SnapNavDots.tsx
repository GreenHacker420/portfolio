"use client";

import { useEffect, useMemo, useState } from "react";
import type Lenis from "lenis";

type Props = {
  lenis: Lenis | null;
  alignment?: "start" | "center" | "end";
  className?: string;
};

export default function SnapNavDots({ lenis, alignment = "start", className = "" }: Props) {
  const [sections, setSections] = useState<HTMLElement[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const easing = useMemo(() => (t: number) => 1 - Math.pow(1 - t, 3), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-snap-section]'));
    setSections(nodes);

    const updateActive = () => {
      const mid = window.innerHeight / 2;
      let closestIdx = 0;
      let closestDist = Infinity;
      nodes.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const top = rect.top;
        const centerDist = Math.abs(top - (alignment === "center" ? mid : 0));
        if (centerDist < closestDist) {
          closestDist = centerDist;
          closestIdx = i;
        }
      });
      setActiveIndex(closestIdx);
    };

    let rafPending = false;
    const onScroll = () => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        updateActive();
        rafPending = false;
      });
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll as any);
      window.removeEventListener("resize", onScroll as any);
    };
  }, [alignment]);

  if (!sections.length) return null;

  return (
    <div className={`fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col space-y-3 ${className}`} aria-label="Section navigation">
      {sections.map((el, i) => (
        <button
          key={el.id || i}
          aria-label={`Go to section ${el.getAttribute('aria-label') || el.id || i + 1}`}
          onClick={() => {
            if (!lenis) return;
            lenis.scrollTo(el, { duration: 0.7, easing, lock: true });
          }}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-green/60 ${
            activeIndex === i ? "bg-white scale-125" : "bg-gray-500/70 hover:bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

