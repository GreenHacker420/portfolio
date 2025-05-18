
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

const HexagonModel = () => {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  
  // Using react-spring for smooth animations
  const { scale, emissiveIntensity, rotation } = useSpring({
    scale: hovered ? 1.1 : 1,
    emissiveIntensity: hovered ? 0.8 : 0.5,
    rotation: hovered ? [0, Math.PI * 0.5, 0] : [0, 0, 0],
    config: { mass: 2, tension: 200, friction: 40 }
  });
  
  useFrame((state) => {
    if (mesh.current) {
      // Continuous rotation regardless of hover state
      mesh.current.rotation.y += 0.005;
      
      // Add subtle floating animation
      mesh.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });
  
  return (
    <animated.mesh 
      ref={mesh} 
      position={[0, 0, 0]} 
      castShadow
      scale={scale}
      rotation-x={rotation.to((_, y, __) => y)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <cylinderGeometry args={[2, 2, 0.5, 6, 1]} />
      <animated.meshStandardMaterial 
        color="#3fb950" 
        emissive="#3fb950"
        emissiveIntensity={emissiveIntensity}
        metalness={0.8}
        roughness={0.2}
      />
      <mesh position={[0, 0, 0.251]} castShadow>
        <ringGeometry args={[0.8, 1.5, 6]} />
        <animated.meshStandardMaterial 
          color="#3fb950" 
          emissive="#3fb950"
          emissiveIntensity={emissiveIntensity}
          metalness={0.8}
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </animated.mesh>
  );
};

export default HexagonModel;
