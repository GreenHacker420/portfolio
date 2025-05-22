
import { gsap } from 'gsap';

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
