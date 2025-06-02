
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Mesh, MeshStandardMaterial, Color } from 'three';
import { KeyboardKey } from '../../../data/keyboardData';
import { Skill } from '../../../data/skillsData';
import { calculateSpringAnimation, DEFAULT_SPRING } from '../../../utils/keyboardUtils';
import '../../../types/three-jsx';

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
    const pressDistance = 0.1; // Reduced travel distance for a more modern feel
    meshRef.current.position.z = -newAnimState.position * pressDistance;

    // Update emissive color based on RGB lighting
    if (materialRef.current) {
      const emissiveIntensity = hovered || isPressed ? 0.5 : 0.3;
      materialRef.current.emissive = new Color(
        rgbColor[0] * emissiveIntensity,
        rgbColor[1] * emissiveIntensity,
        rgbColor[2] * emissiveIntensity
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

  // Determine key color - use skill color if available, otherwise use a dark gray
  const keyColor = isSkillKey ? skill.color : "#333333";

  return (
    /* @ts-ignore */
    <group
      position={[position[0] * 0.8, position[1] * 0.8, position[2]]}
      rotation={[rotation[0], rotation[1], rotation[2]]}
    >
      {/* Main key cap with modern, slightly rounded shape */}
      {/* @ts-ignore */}
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
        {/* Slightly rounded box for more modern look */}
        {/* @ts-ignore */}
        <boxGeometry
          args={[keyWidth, keyHeight, keyDepth]}
        />

        {/* Material with slight metallic look for modern appearance */}
        {/* @ts-ignore */}
        <meshStandardMaterial
          ref={materialRef}
          color={keyColor}
          metalness={0.6}
          roughness={0.2}
          emissive={new Color(rgbColor[0], rgbColor[1], rgbColor[2])}
          emissiveIntensity={0.3}
        />

        {/* Key label - white text on modern key */}
        <Text
          position={[0, 0, keyDepth / 2 + 0.01]}
          fontSize={textSize}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={keyWidth * 0.8}
          overflowWrap="break-word"
          textAlign="center"
          fontWeight="bold"
        >
          {keyData.label}
        </Text>

        {/* Skill logo (if applicable) */}
        {isSkillKey && (
          /* @ts-ignore */
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
          {/* @ts-ignore */}
          </group>
        )}
      {/* @ts-ignore */}
      </mesh>

      {/* Simplified key stem/switch for modern appearance */}
      {/* @ts-ignore */}
      <mesh position={[0, -0.1, -keyDepth / 2 - 0.05]} scale={[0.8, 0.8, 0.8]}>
        {/* @ts-ignore */}
        <boxGeometry args={[0.2, 0.2, 0.1]} />
        {/* @ts-ignore */}
        <meshStandardMaterial color="#111111" />
      {/* @ts-ignore */}
      </mesh>
    {/* @ts-ignore */}
    </group>
  );
};

export default KeyCap;
