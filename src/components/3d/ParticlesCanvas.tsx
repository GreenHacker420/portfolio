
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Points, PointMaterial } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';

interface ParticlesCanvasProps {
  color?: string;
  size?: number;
  count?: number;
}

const ParticlesCanvas = ({ 
  color = "#3ae371", 
  size = 0.06, 
  count = 2000 
}: ParticlesCanvasProps) => {
  const ref = useRef<THREE.Points>(null!);
  
  // Create particle positions
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
  
  // Animate particles with basic rotation
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.01;
      ref.current.rotation.y += delta * 0.015;
    }
  });
  
  // Using animated.group instead of trying to apply springs directly to Points
  const { scale } = useSpring({
    from: { scale: 0.8 },
    to: { scale: 1 },
    config: { mass: 2, tension: 200, friction: 30 }
  });

  return (
    <animated.group scale={scale}>
      <Points
        ref={ref}
        positions={particles}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color={color}
          size={size}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </animated.group>
  );
};

export default ParticlesCanvas;
