
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import '../../types/react-three-fiber';

const HexagonModel = () => {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  // Using react-spring for smooth animations
  const { scale, emissiveIntensity } = useSpring({
    scale: hovered ? 1.1 : 1,
    emissiveIntensity: hovered ? 0.8 : 0.5,
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

  // Create geometry and materials using Three.js directly
  const cylinderGeometry = new THREE.CylinderGeometry(2, 2, 0.5, 6);
  const ringGeometry = new THREE.RingGeometry(0.8, 1.5, 6);

  return (
    <animated.mesh
      ref={mesh}
      position={[0, 0, 0]}
      castShadow
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      geometry={cylinderGeometry}
    >
      <animated.meshStandardMaterial
        color="#3fb950"
        emissive="#3fb950"
        emissiveIntensity={emissiveIntensity}
        metalness={0.8}
        roughness={0.2}
      />
    </animated.mesh>
  );
};

export default HexagonModel;
