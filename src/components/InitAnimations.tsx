"use client";
import { useEffect } from "react";
import { animateIn, textFlicker } from '@/utils/animation-anime';

export default function InitAnimations() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const startTime = performance.now();

    const initAnimations = () => {
      try {
        animateIn('.section-title');
        const sections = document.querySelectorAll('section');
        sections.forEach((section) => {
          if (!section.id) return;
          animateIn(`#${section.id} .section-title`);
          animateIn(`#${section.id} .about-item`, { delay: 50 });
          animateIn(`#${section.id} .anim`, { delay: 80 });
        });
        document.querySelectorAll('.section-title').forEach((t) => {
          try { textFlicker(t as HTMLElement); } catch {}
        });
        const endTime = performance.now();
        console.log(`Animation initialization took ${endTime - startTime} milliseconds`);
      } catch (error) {
        console.error('Failed to initialize animations:', error);
      }
    };

    const timeoutId = setTimeout(initAnimations, 100);

    return () => {
      clearTimeout(timeoutId);
      try {
        // Optional: cleanup if your animation library exposes it
        // ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      } catch (error) {
        console.warn('Failed to clean up animations:', error);
      }
    };
  }, []);

  return null;
}

