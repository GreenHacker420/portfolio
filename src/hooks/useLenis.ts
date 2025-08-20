'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import Snap from 'lenis/snap';

export function useLenis(enabled: boolean = true) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 0.7, // seconds
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // cubic ease-out
      smoothWheel: true,
      allowNestedScroll: true,
      anchors: true,
      autoRaf: false,
    });

    lenisRef.current = lenis;

    // Initialize Lenis Snap plugin targeting each section
    const snap = new Snap(lenis, {
      type: 'mandatory',
      duration: 0.7, // seconds
      easing: (t) => 1 - Math.pow(1 - t, 3),
      debounce: 80,
    });

    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-snap-section]'));
    const cleanups: Array<() => boolean> = [];
    sections.forEach((el) => {
      // Ensure each target is at least viewport height
      if (el.style.minHeight === '') el.style.minHeight = '100vh';
      cleanups.push(snap.addElement(el, { align: 'start', ignoreSticky: true }));
    });

    // Landing effect using IntersectionObserver
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            // toggle landing class
            target.classList.remove('snap-landed');
            void target.offsetWidth;
            target.classList.add('snap-landed');
          }
        });
      },
      { threshold: [0, 0.6, 1] }
    );
    sections.forEach((el) => io.observe(el));

    // RAF loop
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      cleanups.forEach((fn) => fn());
      snap.destroy();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);

  return lenisRef.current;
}

