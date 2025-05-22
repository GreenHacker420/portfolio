// Utility functions for loading and managing skill logos

import * as THREE from 'three';
import { TextureLoader } from 'three';

// Cache for loaded textures to avoid redundant loading
const textureCache: Record<string, THREE.Texture> = {};

// Load a texture and cache it
export const loadTexture = (url: string): Promise<THREE.Texture> => {
  // Return from cache if already loaded
  if (textureCache[url]) {
    return Promise.resolve(textureCache[url]);
  }

  // Create a new loader
  const loader = new TextureLoader();
  
  // Return a promise that resolves with the loaded texture
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (texture) => {
        // Cache the texture
        textureCache[url] = texture;
        resolve(texture);
      },
      undefined, // onProgress callback not needed
      (error) => {
        console.error(`Error loading texture ${url}:`, error);
        reject(error);
      }
    );
  });
};

// Get the URL for a skill logo
export const getSkillLogoUrl = (skillId: string): string => {
  // Map skill IDs to their logo image paths
  const logoMap: Record<string, string> = {
    js: '/assets/logos/javascript.png',
    ts: '/assets/logos/typescript.png',
    react: '/assets/logos/react.png',
    node: '/assets/logos/nodejs.png',
    python: '/assets/logos/python.png',
    aws: '/assets/logos/aws.png',
    docker: '/assets/logos/docker.png',
    mongodb: '/assets/logos/mongodb.png',
    postgres: '/assets/logos/postgresql.png',
    graphql: '/assets/logos/graphql.png',
    vue: '/assets/logos/vuejs.png',
    tailwind: '/assets/logos/tailwindcss.png',
    threejs: '/assets/logos/threejs.png',
    git: '/assets/logos/git.png',
    nextjs: '/assets/logos/nextjs.png',
  };

  return logoMap[skillId] || '/assets/logos/placeholder.png';
};

// Preload all skill logos
export const preloadAllLogos = async (): Promise<void> => {
  const skillIds = [
    'js', 'ts', 'react', 'node', 'python', 'aws', 'docker', 
    'mongodb', 'postgres', 'graphql', 'vue', 'tailwind',
    'threejs', 'git', 'nextjs'
  ];

  try {
    await Promise.all(skillIds.map(id => loadTexture(getSkillLogoUrl(id))));
    console.log('All skill logos preloaded successfully');
  } catch (error) {
    console.error('Error preloading skill logos:', error);
  }
};

// Create a fallback texture for when logo loading fails
export const createFallbackTexture = (text: string): THREE.Texture => {
  // Create a canvas to draw the text
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  
  if (context) {
    // Fill background
    context.fillStyle = '#333333';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw text
    context.fillStyle = '#ffffff';
    context.font = 'bold 48px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
  }
  
  // Create texture from canvas
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  
  return texture;
};
