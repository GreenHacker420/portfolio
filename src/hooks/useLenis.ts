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


  // (Optional) You can keep the IntersectionObserver for landing effects if needed, or remove it entirely.
  // If you want to keep the landing effect, uncomment below:
  // const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-snap-section]'));
  // const io = new IntersectionObserver(
  //   (entries) => {
  //     entries.forEach((entry) => {
  //       const target = entry.target as HTMLElement;
  //       if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
  //         target.classList.remove('snap-landed');
  //         void target.offsetWidth;
  //         target.classList.add('snap-landed');
  //       }
  //     });
  //   },
  //   { threshold: [0, 0.6, 1] }
  // );
  // sections.forEach((el) => io.observe(el));

    // RAF loop
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      // If you kept the IntersectionObserver, disconnect it here:
      // io.disconnect();
      // cleanups.forEach((fn) => fn());
      // snap.destroy();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);

  return lenisRef.current;
}

