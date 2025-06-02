
import { gsap } from 'gsap';

// Matrix-like terminal effect for text
export const terminalTextEffect = (element: HTMLElement, text: string, speed: number = 30) => {
  if (typeof document === 'undefined' || !element) return;

  let i = 0;
  element.innerHTML = '';

  const typeNextChar = () => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typeNextChar, speed);
    }
  };

  typeNextChar();
};

// Reveal animation for GitHub contributions graph
export const animateGithubGraph = () => {
  if (typeof document === 'undefined') return;

  const cells = document.querySelectorAll('.github-cell');

  gsap.fromTo(
    cells,
    { opacity: 0, scale: 0.8 },
    {
      opacity: 1,
      scale: 1,
      stagger: {
        grid: [7, 52],
        from: "start",
        amount: 1.5
      },
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.github-graph',
        start: 'top bottom-=100'
      }
    }
  );
};

// Neon flicker effect for hero text
export const neonFlickerEffect = (element: HTMLElement) => {
  const timeline = gsap.timeline({ repeat: -1, repeatDelay: 5 });

  timeline
    .to(element, { textShadow: '0 0 10px rgba(63, 185, 80, 0.8), 0 0 20px rgba(63, 185, 80, 0.5)', duration: 0.1 })
    .to(element, { textShadow: 'none', duration: 0.1 })
    .to(element, { textShadow: '0 0 10px rgba(63, 185, 80, 0.8), 0 0 20px rgba(63, 185, 80, 0.5)', duration: 0.1 })
    .to(element, { textShadow: 'none', duration: 0.1 })
    .to(element, { textShadow: '0 0 10px rgba(63, 185, 80, 0.8), 0 0 20px rgba(63, 185, 80, 0.5)', duration: 0.1 });

  return timeline;
};
