import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Mesh, MeshStandardMaterial, Color } from 'three';
import { KeyboardKey } from '../../../data/keyboardData';
import { Skill } from '../../../data/skillsData';
import { calculateSpringAnimation, DEFAULT_SPRING } from '../../../utils/keyboardUtils';

interface KeyCapProps {
  keyData: KeyboardKey;
  skill?: Skill;
  isPressed: boolean;
  onClick: () => void;
  rgbColor: [number, number, number];
  keySound?: HTMLAudioElement;
}

const KeyCap: React.FC<KeyCapProps> = ({ 
  keyData, 
  skill, 
  isPressed, 
  onClick, 
  rgbColor,
  keySound
}) => {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const [animState, setAnimState] = useState({ position: 0, velocity: 0 });
  
  // Handle key press animation
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    
    // Calculate spring physics
    const newAnimState = calculateSpringAnimation(
      isPressed,
      animState.velocity,
      animState.position,
      DEFAULT_SPRING,
      delta
    );
    
    setAnimState(newAnimState);
    
    // Apply animation to key position
    const pressDistance = 0.15; // How far the key travels when pressed
    meshRef.current.position.y = -newAnimState.position * pressDistance;
    
    // Update emissive color based on RGB lighting
    if (materialRef.current) {
      materialRef.current.emissive = new Color(
        rgbColor[0] * (hovered ? 1.2 : 1),
        rgbColor[1] * (hovered ? 1.2 : 1),
        rgbColor[2] * (hovered ? 1.2 : 1)
      );
    }
  });
  
  // Play key sound effect when pressed
  useEffect(() => {
    if (isPressed && keySound) {
      keySound.currentTime = 0;
      keySound.play().catch(e => console.error("Error playing key sound:", e));
    }
  }, [isPressed, keySound]);
  
  // Destructure physical properties
  const { size, position, rotation = [0, 0, 0], isSpecial } = keyData.physical;
  const [width, height, depth] = size;
  
  // Calculate actual dimensions (in Three.js units)
  const keyWidth = width * 0.8;
  const keyHeight = height * 0.8;
  const keyDepth = depth * 0.3;
  
  // Calculate text size based on key width
  const textSize = Math.min(0.3, keyWidth * 0.3);
  
  // Determine if this is a skill key
  const isSkillKey = Boolean(skill);
  
  return (
    <group
      position={[position[0] * 0.8, position[1] * 0.8, position[2]]}
      rotation={[rotation[0], rotation[1], rotation[2]]}
    >
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        {/* Key cap geometry */}
        <boxGeometry args={[keyWidth, keyHeight, keyDepth]} />
        
        {/* Key material with RGB lighting */}
        <meshStandardMaterial
          ref={materialRef}
          color={isSkillKey ? skill.color : "#333333"}
          metalness={0.5}
          roughness={0.2}
          emissive={new Color(rgbColor[0], rgbColor[1], rgbColor[2])}
        />
        
        {/* Key label */}
        <Text
          position={[0, 0, keyDepth / 2 + 0.01]}
          fontSize={textSize}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={keyWidth * 0.8}
          overflowWrap="break-word"
          textAlign="center"
        >
          {keyData.label}
        </Text>
        
        {/* Skill logo (if applicable) */}
        {isSkillKey && (
          <group position={[0, -0.15, keyDepth / 2 + 0.01]}>
            {/* Logo would be implemented here - for now using text */}
            <Text
              fontSize={textSize * 0.8}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {skill.logo}
            </Text>
          </group>
        )}
      </mesh>
      
      {/* Key stem/switch (simplified) */}
      <mesh position={[0, 0, -keyDepth / 2 - 0.05]}>
        <boxGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </group>
  );
};

export default KeyCap;
