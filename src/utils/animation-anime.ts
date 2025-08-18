'use client';

async function ensureAnime() {
  const mod = await import('animejs');
  // Support both CJS and ESM builds
  return (mod as any).default || (mod as any).anime || (mod as any);
}

export function animateIn(selector: string, opts?: { delay?: number }) {
  if (typeof window === 'undefined') return;
  const els = document.querySelectorAll(selector);
  ensureAnime().then((anime: any) => {
    anime({
      targets: els,
      translateY: [20, 0],
      opacity: [0, 1],
      easing: 'easeOutQuad',
      delay: anime.stagger(80, { start: opts?.delay || 0 }),
      duration: 500,
    });
  });
}

export function hoverLift(el: HTMLElement, entering: boolean) {
  ensureAnime().then((anime: any) => {
    anime({ targets: el, translateY: entering ? -6 : 0, scale: entering ? 1.02 : 1, easing: 'easeOutQuad', duration: 250 });
  });
}

export function textFlicker(el: HTMLElement) {
  ensureAnime().then((anime: any) => {
    anime.timeline({ loop: true, direction: 'alternate' })
      .add({ targets: el, textShadow: ['0 0 0 rgba(0,0,0,0)', '0 0 12px rgba(63,185,80,0.8), 0 0 24px rgba(63,185,80,0.5)'], duration: 120, easing: 'linear' })
      .add({ targets: el, textShadow: ['0 0 12px rgba(63,185,80,0.8), 0 0 24px rgba(63,185,80,0.5)', '0 0 0 rgba(0,0,0,0)'], duration: 120, easing: 'linear' });
  });
}

