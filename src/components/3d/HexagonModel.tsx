
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const HexagonModel = () => {
  const mesh = useRef<THREE.Mesh>(null!);
  
  // Since we don't have an actual GLTF model, we'll create a hexagon mesh
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.005;
      mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]} castShadow>
      <cylinderGeometry args={[2, 2, 0.5, 6, 1]} />
      <meshStandardMaterial 
        color="#3fb950" 
        emissive="#3fb950"
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
      <mesh position={[0, 0, 0.251]} castShadow>
        <ringGeometry args={[0.8, 1.5, 6]} />
        <meshStandardMaterial 
          color="#3fb950" 
          emissive="#3fb950"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </mesh>
  );
};

export default HexagonModel;
