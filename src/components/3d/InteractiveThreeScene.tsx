
import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface InteractiveThreeSceneProps {
  color?: string;
  count?: number;
  size?: number;
  mouseInfluence?: number;
}

const InteractiveThreeScene = ({
  color = "#3fb950",
  count = 2000,
  size = 0.06,
  mouseInfluence = 0.05,
}: InteractiveThreeSceneProps) => {
  // Create a reference to the points object
  const pointsRef = useRef<THREE.Points>(null!);

  // Get the mouse and viewport from Three
  const { mouse, viewport } = useThree();

  // Store the original particle positions
  const [particlePositions, setParticlePositions] = useState<Float32Array | null>(null);



  // Create particle positions
  useEffect(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Create particles in a more cloud-like formation to match the nebula image
      const radius = Math.random() * 5 + 0.5;
      const phi = Math.acos((Math.random() * 2) - 1);
      const theta = Math.random() * Math.PI * 2;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);     // x
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
      positions[i * 3 + 2] = radius * Math.cos(phi) * 0.5;            // z - flatter on z-axis
    }

    setParticlePositions(positions);
  }, [count]);

  // Animation frame loop
  useFrame((state) => {
    if (!pointsRef.current || !particlePositions) return;

    // Rotate the particle system
    pointsRef.current.rotation.y += 0.0008;

    // Apply mouse influence to camera
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      mouse.x * mouseInfluence,
      0.05
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      mouse.y * mouseInfluence,
      0.05
    );

    // Look at center
    state.camera.lookAt(0, 0, 0);

    // Update uniforms
    if (pointsRef.current.material instanceof THREE.ShaderMaterial) {
      pointsRef.current.material.uniforms.time.value = state.clock.getElapsedTime();
      pointsRef.current.material.uniforms.mousePosition.value.set(
        mouse.x * viewport.width / 2,
        mouse.y * viewport.height / 2
      );
    }
  });

  if (!particlePositions) return null;

  // Create geometry and material using Three.js directly
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const material = new THREE.PointsMaterial({
    color: color,
    size: size,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
  });

  return (
    /* @ts-ignore */
    <points ref={pointsRef} geometry={geometry} material={material} />
  );
};

export default InteractiveThreeScene;
