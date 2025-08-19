'use client';

let cachedAnime: any | null = null;

async function ensureAnime() {
  if (cachedAnime) return cachedAnime;
  try {
    const mod: any = await import('animejs');
    const candidates = [mod?.default, mod?.anime, mod?.default?.anime, mod];
    for (const c of candidates) {
      if (typeof c === 'function') { cachedAnime = c; return c; }
    }
  } catch {}
  // Fallback no-op stub to avoid runtime errors/spam in dev
  const animeStub: any = (opts?: any) => {
    const t = opts?.targets as any;
    try {
      // If targets is a NodeList/array, just make them visible immediately
      if (t && typeof t.forEach === 'function') {
        t.forEach((el: any) => { if (el?.style) { el.style.opacity='1'; el.style.transform='none'; }});
      }
      // If targets is a plain object (e.g., { val: 0 }) and numeric props are provided in opts,
      // set them to their final values so UI reflects the correct numbers without animation.
      if (t && typeof t === 'object' && !('length' in t)) {
        for (const key of Object.keys(opts || {})) {
          if (typeof (t as any)[key] === 'number' && typeof (opts as any)[key] === 'number') {
            (t as any)[key] = (opts as any)[key];
          }
        }
      }
      if (typeof opts?.update === 'function') { opts.update(); }
    } catch {}
    return { finished: Promise.resolve() };
  };
  animeStub.stagger = () => 0;
  cachedAnime = animeStub;
  return animeStub;
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
      delay: anime.stagger ? anime.stagger(80, { start: opts?.delay || 0 }) : 0,
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
    if (!anime?.timeline) return;
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

