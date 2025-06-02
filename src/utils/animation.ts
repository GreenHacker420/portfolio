
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugins only on client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// Initialize smooth scrolling with GSAP
export const initSmoothScrolling = () => {
  if (typeof window === 'undefined') return;

  // Add smooth scrolling to all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute('href') || '');
      if (target) {
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: target, offsetY: 80 },
          ease: 'power3.inOut'
        });
      }
    });
  });
};

// Initialize scroll animations for various elements
export const initScrollAnimations = () => {
  if (typeof window === 'undefined') return;

  // Animate section headings on scroll
  gsap.utils.toArray('.section-title').forEach((heading: any) => {
    gsap.fromTo(
      heading,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: heading,
          start: 'top bottom-=100',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Staggered animation for skills items
  gsap.utils.toArray('.skills-grid').forEach((grid: any) => {
    const items = gsap.utils.toArray('.skill-item', grid);

    gsap.fromTo(
      items,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top bottom-=50',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Project cards animation
  gsap.utils.toArray('.project-card').forEach((card: any) => {
    gsap.fromTo(
      card,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom-=50',
          toggleActions: 'play none none none'
        }
      }
    );
  });
};

// Matrix-like terminal effect for text
export const terminalTextEffect = (element: HTMLElement, text: string, speed: number = 30) => {
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
  if (typeof window === 'undefined') return;

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

// Parallax effect for sections
export const createParallaxEffect = () => {
  if (typeof window === 'undefined') return;

  gsap.utils.toArray('section').forEach((section: any) => {
    const bg = section.querySelector('.section-bg');
    if (bg) {
      gsap.to(bg, {
        y: '30%',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  });
};

// Fix for skill hover selectors to avoid CSS selector issues
export const handleSkillHover = (element: HTMLElement, isEntering: boolean) => {
  if (isEntering) {
    gsap.to(element, {
      y: -5,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
      duration: 0.3,
      ease: 'power2.out'
    });
  } else {
    gsap.to(element, {
      y: 0,
      boxShadow: 'none',
      duration: 0.3,
      ease: 'power2.in'
    });
  }
};

// Project card hover effect
export const projectCardHover = (element: HTMLElement, isEntering: boolean) => {
  if (isEntering) {
    gsap.to(element, {
      y: -8,
      scale: 1.02,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
      duration: 0.4,
      ease: 'power2.out'
    });
  } else {
    gsap.to(element, {
      y: 0,
      scale: 1,
      boxShadow: 'none',
      duration: 0.4,
      ease: 'power2.in'
    });
  }
};
