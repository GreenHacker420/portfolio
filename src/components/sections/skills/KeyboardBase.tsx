
import React from 'react';
import { useTexture } from '@react-three/drei';
import { MeshStandardMaterial } from 'three';

interface KeyboardBaseProps {
  width: number;
  height: number;
  depth: number;
  color?: string;
  rgbGlow?: [number, number, number];
}

const KeyboardBase: React.FC<KeyboardBaseProps> = ({
  width,
  height,
  depth,
  color = '#222222',
  rgbGlow = [0, 0, 0]
}) => {
  // Load textures for the keyboard base
  const textures = useTexture({
    normalMap: '/textures/keyboard_normal.jpg',
    roughnessMap: '/textures/keyboard_roughness.jpg',
    aoMap: '/textures/keyboard_ao.jpg',
  });

  // Create materials for different parts of the keyboard
  const baseMaterial = new MeshStandardMaterial({
    color,
    metalness: 0.4,
    roughness: 0.8,
    ...textures,
    emissive: color,
    emissiveIntensity: 0.05,
  });

  const edgeMaterial = new MeshStandardMaterial({
    color,
    metalness: 0.6,
    roughness: 0.5,
    emissive: `rgb(${rgbGlow[0] * 255}, ${rgbGlow[1] * 255}, ${rgbGlow[2] * 255})`,
    emissiveIntensity: 0.3,
  });

  const bottomMaterial = new MeshStandardMaterial({
    color: '#111111',
    metalness: 0.2,
    roughness: 0.9,
  });

  // Calculate dimensions for the keyboard parts
  const baseWidth = width;
  const baseHeight = height;
  const baseDepth = depth * 0.7;
  
  const edgeWidth = width + 0.4;
  const edgeHeight = height + 0.4;
  const edgeDepth = depth * 0.2;
  
  const bottomWidth = width;
  const bottomHeight = height;
  const bottomDepth = depth * 0.1;
  
  // Calculate positions
  const basePosition: [number, number, number] = [0, 0, 0];
  const edgePosition: [number, number, number] = [0, 0, -baseDepth / 2 - edgeDepth / 2];
  const bottomPosition: [number, number, number] = [0, 0, -baseDepth / 2 - edgeDepth - bottomDepth / 2];

  return (
    <group>
      {/* Main keyboard base */}
      <mesh 
        position={basePosition} 
        material={baseMaterial}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[baseWidth, baseHeight, baseDepth]} />
      </mesh>

      {/* Edge with RGB glow */}
      <mesh 
        position={edgePosition} 
        material={edgeMaterial}
        castShadow
      >
        <boxGeometry args={[edgeWidth, edgeHeight, edgeDepth]} />
      </mesh>

      {/* Bottom of keyboard */}
      <mesh 
        position={bottomPosition} 
        material={bottomMaterial}
        castShadow
      >
        <boxGeometry args={[bottomWidth, bottomHeight, bottomDepth]} />
      </mesh>
      
      {/* Rubber feet at corners */}
      {[
        [bottomWidth / 2 - 0.5, bottomHeight / 2 - 0.5, -bottomDepth / 2 - 0.05],
        [bottomWidth / 2 - 0.5, -bottomHeight / 2 + 0.5, -bottomDepth / 2 - 0.05],
        [-bottomWidth / 2 + 0.5, bottomHeight / 2 - 0.5, -bottomDepth / 2 - 0.05],
        [-bottomWidth / 2 + 0.5, -bottomHeight / 2 + 0.5, -bottomDepth / 2 - 0.05],
      ].map((pos, index) => (
        <mesh 
          key={`foot-${index}`} 
          position={[
            bottomPosition[0] + pos[0], 
            bottomPosition[1] + pos[1], 
            bottomPosition[2] + pos[2]
          ] as [number, number, number]}
        >
          <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
          <meshStandardMaterial color="#111111" roughness={1} />
        </mesh>
      ))}
      
      {/* USB Cable */}
      <group position={[0, baseHeight / 2 + 0.1, -baseDepth / 4]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
      </group>
    </group>
  );
};

export default KeyboardBase;
