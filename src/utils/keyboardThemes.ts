// Keyboard theme definitions

import * as THREE from 'three';

// Theme interface
export interface KeyboardTheme {
  name: string;
  description: string;
  baseColor: string;
  accentColor: string;
  keycapColor: string;
  textColor: string;
  rgbLight: boolean;
  soundType: 'blue' | 'brown' | 'red' | 'silent';
  metalness: number;
  roughness: number;
  ambientLightColor: string;
  ambientLightIntensity: number;
  spotLightColor: string;
  spotLightIntensity: number;
  environmentPreset: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby';
}

// Define keyboard themes
export const keyboardThemes: Record<string, KeyboardTheme> = {
  // Default theme - Modern RGB
  modern: {
    name: 'Modern RGB',
    description: 'A sleek modern keyboard with RGB lighting',
    baseColor: '#121212',
    accentColor: '#00ff99',
    keycapColor: '#1a1a1a',
    textColor: '#ffffff',
    rgbLight: true,
    soundType: 'blue',
    metalness: 0.8,
    roughness: 0.2,
    ambientLightColor: '#ffffff',
    ambientLightIntensity: 0.3,
    spotLightColor: '#ffffff',
    spotLightIntensity: 1,
    environmentPreset: 'city'
  },
  
  // Retro theme - Vintage beige
  retro: {
    name: 'Vintage Retro',
    description: 'A classic beige keyboard with a nostalgic feel',
    baseColor: '#d8c0a8',
    accentColor: '#b85c38',
    keycapColor: '#f5f5dc',
    textColor: '#333333',
    rgbLight: false,
    soundType: 'brown',
    metalness: 0.1,
    roughness: 0.8,
    ambientLightColor: '#fff8e7',
    ambientLightIntensity: 0.5,
    spotLightColor: '#fff8e7',
    spotLightIntensity: 0.8,
    environmentPreset: 'apartment'
  },
  
  // Cyberpunk theme
  cyberpunk: {
    name: 'Cyberpunk',
    description: 'A futuristic neon-lit keyboard with vibrant colors',
    baseColor: '#0a0a16',
    accentColor: '#ff00ff',
    keycapColor: '#1a1a2e',
    textColor: '#00ffff',
    rgbLight: true,
    soundType: 'blue',
    metalness: 0.9,
    roughness: 0.1,
    ambientLightColor: '#ff00ff',
    ambientLightIntensity: 0.2,
    spotLightColor: '#00ffff',
    spotLightIntensity: 1.2,
    environmentPreset: 'night'
  },
  
  // Minimalist theme
  minimalist: {
    name: 'Minimalist',
    description: 'A clean, simple keyboard with a focus on functionality',
    baseColor: '#ffffff',
    accentColor: '#cccccc',
    keycapColor: '#f0f0f0',
    textColor: '#333333',
    rgbLight: false,
    soundType: 'silent',
    metalness: 0.3,
    roughness: 0.7,
    ambientLightColor: '#ffffff',
    ambientLightIntensity: 0.7,
    spotLightColor: '#ffffff',
    spotLightIntensity: 0.5,
    environmentPreset: 'studio'
  },
  
  // Dark mode theme
  darkMode: {
    name: 'Dark Mode',
    description: 'A sleek black keyboard with subtle accents',
    baseColor: '#000000',
    accentColor: '#444444',
    keycapColor: '#222222',
    textColor: '#aaaaaa',
    rgbLight: false,
    soundType: 'red',
    metalness: 0.6,
    roughness: 0.4,
    ambientLightColor: '#aaaaaa',
    ambientLightIntensity: 0.2,
    spotLightColor: '#ffffff',
    spotLightIntensity: 0.8,
    environmentPreset: 'warehouse'
  }
};

// Get theme colors as THREE.Color objects
export const getThemeColors = (theme: KeyboardTheme) => {
  return {
    base: new THREE.Color(theme.baseColor),
    accent: new THREE.Color(theme.accentColor),
    keycap: new THREE.Color(theme.keycapColor),
    text: new THREE.Color(theme.textColor),
    ambientLight: new THREE.Color(theme.ambientLightColor),
    spotLight: new THREE.Color(theme.spotLightColor)
  };
};
