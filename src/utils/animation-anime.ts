'use client';

async function ensureAnime() {
  const mod: any = await import('animejs');
  // Resolve a callable anime function from various module shapes
  const candidates = [mod?.default, mod?.anime, mod?.default?.anime, mod];
  for (const c of candidates) {
    if (typeof c === 'function') return c;
  }
  console.warn('Failed to resolve anime function from module', mod);
  return null;
}

export function animateIn(selector: string, opts?: { delay?: number }) {
  if (typeof window === 'undefined') return;
  let els: NodeListOf<Element> | [] = [];
  try {
    els = document.querySelectorAll(selector);
  } catch (e) {
    console.warn('animateIn: invalid selector', selector, e);
    return;
  }
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    (els as NodeListOf<Element>).forEach((el) => { (el as HTMLElement).style.opacity = '1'; (el as HTMLElement).style.transform = 'none'; });
    return;
  }
  ensureAnime().then((anime: any) => {
    if (!anime) return;
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
    if (!anime) return;
    anime.timeline({ loop: true, direction: 'alternate' })
      .add({ targets: el, textShadow: ['0 0 0 rgba(0,0,0,0)', '0 0 12px rgba(63,185,80,0.8), 0 0 24px rgba(63,185,80,0.5)'], duration: 120, easing: 'linear' })
      .add({ targets: el, textShadow: ['0 0 12px rgba(63,185,80,0.8), 0 0 24px rgba(63,185,80,0.5)', '0 0 0 rgba(0,0,0,0)'], duration: 120, easing: 'linear' });
  });
}

export function countNumber(el: HTMLElement, to: number, opts?: { duration?: number; easing?: string; formatter?: (n:number)=>string }) {
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) { el.textContent = (opts?.formatter || ((n)=>String(Math.round(n))))(to); return; }
  ensureAnime().then((anime: any) => {
    if (!anime) { el.textContent = (opts?.formatter || ((n)=>String(Math.round(n))))(to); return; }
    const obj = { val: 0 };
    anime({
      targets: obj,
      val: to,
      round: 1,
      duration: opts?.duration ?? 800,
      easing: opts?.easing ?? 'easeOutQuad',
      update: () => { el.textContent = (opts?.formatter || ((n)=>String(Math.round(n))))(obj.val); }
    });
  });
}

