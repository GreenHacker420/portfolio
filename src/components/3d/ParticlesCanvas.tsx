
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Points, PointMaterial } from '@react-three/drei';
import { useSpring } from '@react-spring/three';

const ParticlesCanvas = (props) => {
  const ref = useRef();
  
  // Create particle positions
  const count = 2000;
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Create a sphere of particles
      const radius = Math.random() * 4 + 1;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);     // x
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
      positions[i * 3 + 2] = radius * Math.cos(phi);                  // z
    }
    
    return positions;
  }, [count]);
  
  // Animate particles
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.01;
      ref.current.rotation.y += delta * 0.015;
    }
  });
  
  // Animate on hover/scroll with spring physics
  const [spring, api] = useSpring(() => ({
    scale: 1,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    config: { mass: 2, tension: 200, friction: 30 }
  }));
  
  // Use Three.js objects that fit the types expected by Points
  const scaleVector = useMemo(() => new THREE.Vector3(1, 1, 1), []);
  const positionVector = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const rotationEuler = useMemo(() => new THREE.Euler(0, 0, 0), []);
  
  // Update vectors based on spring values
  useFrame(() => {
    const scaleValue = spring.scale.get();
    scaleVector.set(scaleValue, scaleValue, scaleValue);
    
    const position = spring.position.get();
    positionVector.set(position[0], position[1], position[2]);
    
    const rotation = spring.rotation.get();
    rotationEuler.set(rotation[0], rotation[1], rotation[2]);
    
    if (ref.current) {
      ref.current.scale.copy(scaleVector);
      ref.current.position.copy(positionVector);
      ref.current.rotation.x = rotationEuler.x;
      ref.current.rotation.y = rotationEuler.y;
      ref.current.rotation.z = rotationEuler.z;
    }
  });

  return (
    <group>
      <Points
        ref={ref}
        positions={particles}
        stride={3}
        frustumCulled={false}
        {...props}
      >
        <PointMaterial
          transparent
          color="#3ae371"
          size={0.06}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};

export default ParticlesCanvas;
