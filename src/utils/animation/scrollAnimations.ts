
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Initialize smooth scrolling with GSAP
export const initSmoothScrolling = () => {
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

// Parallax effect for sections
export const createParallaxEffect = () => {
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
