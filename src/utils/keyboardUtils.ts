
// Utility functions for keyboard animations and effects

import { MathUtils } from 'three';
import { RGBTheme } from '../data/keyboardData';

// Convert a hex color to RGB components
export const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
    : [0, 0, 0];
};

// Generate a rainbow color based on position and time
export const getRainbowColor = (
  x: number,
  y: number,
  time: number,
  speed: number = 1
): [number, number, number] => {
  const hue = ((x + y) * 0.05 + time * speed) % 1;
  return hslToRgb(hue, 0.8, 0.5);
};

// Convert HSL to RGB
export const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r, g, b];
};

// Calculate key color based on theme, position, and time
export const calculateKeyColor = (
  theme: any,
  x: number,
  y: number,
  time: number,
  isPressed: boolean = false,
  isSkillKey: boolean = false
): [number, number, number] => {
  // Base intensity from theme
  let intensity = theme.intensity || 0.8;
  
  // Increase intensity for pressed keys
  if (isPressed) {
    intensity = Math.min(1, intensity * 1.5);
  }
  
  // Increase intensity for skill keys
  if (isSkillKey) {
    intensity = Math.min(1, intensity * 1.2);
  }

  // Calculate color based on theme type
  switch (theme.keyColors) {
    case 'rainbow':
      const rainbowColor = getRainbowColor(x, y, time, theme.speed || 1);
      return rainbowColor.map(c => c * intensity) as [number, number, number];
    
    case 'gradient':
      const baseRgb = hexToRgb(theme.baseColor);
      const accentRgb = hexToRgb(theme.accentColor);
      const gradientFactor = (Math.sin(x * 0.5 + time * (theme.speed || 1)) + 1) / 2;
      return [
        MathUtils.lerp(baseRgb[0], accentRgb[0], gradientFactor) * intensity,
        MathUtils.lerp(baseRgb[1], accentRgb[1], gradientFactor) * intensity,
        MathUtils.lerp(baseRgb[2], accentRgb[2], gradientFactor) * intensity,
      ];
    
    case 'reactive':
      if (isPressed) {
        const accentRgb = hexToRgb(theme.accentColor);
        return accentRgb.map(c => c * intensity) as [number, number, number];
      } else {
        const baseRgb = hexToRgb(theme.baseColor);
        const lowIntensity = intensity * 0.3;
        return baseRgb.map(c => c * lowIntensity) as [number, number, number];
      }
    
    case 'solid':
    default:
      const solidRgb = hexToRgb(theme.accentColor);
      
      // Apply breathing effect if theme animation is breathing
      if (theme.animation === 'breathing') {
        const breathFactor = (Math.sin(time * (theme.speed || 0.5)) + 1) / 2;
        intensity *= 0.3 + breathFactor * 0.7;
      }
      
      return solidRgb.map(c => c * intensity) as [number, number, number];
  }
};

// Calculate ripple effect
export const calculateRippleEffect = (
  x: number,
  y: number,
  rippleX: number,
  rippleY: number,
  rippleTime: number,
  rippleSpeed: number = 1,
  rippleDuration: number = 1
): number => {
  if (rippleTime <= 0) return 0;
  
  const distance = Math.sqrt(Math.pow(x - rippleX, 2) + Math.pow(y - rippleY, 2));
  const rippleProgress = rippleTime * rippleSpeed;
  
  // Ripple wave calculation
  const rippleFactor = Math.max(0, 1 - Math.abs(distance - rippleProgress) / 2);
  
  // Fade out over time
  const timeFade = Math.max(0, 1 - rippleTime / rippleDuration);
  
  return rippleFactor * timeFade;
};

// Spring physics for key press animation
export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

export const DEFAULT_SPRING: SpringConfig = {
  stiffness: 170,
  damping: 26,
  mass: 1,
};

export const TACTILE_SPRING: SpringConfig = {
  stiffness: 200,
  damping: 20,
  mass: 1,
};

export const LINEAR_SPRING: SpringConfig = {
  stiffness: 150,
  damping: 30,
  mass: 1,
};

// Calculate spring physics for key press animation
export const calculateSpringAnimation = (
  pressed: boolean,
  velocity: number,
  position: number,
  config: SpringConfig = DEFAULT_SPRING,
  deltaTime: number = 1/60
): { position: number; velocity: number } => {
  const targetPosition = pressed ? 1 : 0;
  const springForce = -config.stiffness * (position - targetPosition);
  const dampingForce = -config.damping * velocity;
  
  const acceleration = (springForce + dampingForce) / config.mass;
  const newVelocity = velocity + acceleration * deltaTime;
  const newPosition = position + newVelocity * deltaTime;
  
  return {
    position: newPosition,
    velocity: newVelocity,
  };
};
