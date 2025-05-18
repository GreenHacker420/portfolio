
import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
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
  const pointsRef = useRef<THREE.Points>(null!);
  const { mouse, viewport } = useThree();
  
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
  
  // Animate particles with mouse interaction
  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Basic rotation
      pointsRef.current.rotation.x += delta * 0.01;
      pointsRef.current.rotation.y += delta * 0.015;
      
      // Mouse interaction - particles follow mouse
      const mouseX = (mouse.x * viewport.width) / 10;
      const mouseY = (mouse.y * viewport.height) / 10;
      
      // Smooth mouse following
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(
        pointsRef.current.rotation.x,
        pointsRef.current.rotation.x + mouseY * 0.05,
        0.1
      );
      
      pointsRef.current.rotation.y = THREE.MathUtils.lerp(
        pointsRef.current.rotation.y,
        pointsRef.current.rotation.y + mouseX * 0.05,
        0.1
      );
    }
  });
  
  // Using React Spring for animation
  const { scale } = useSpring({
    scale: 1,
    from: { scale: 0.5 },
    config: { mass: 2, tension: 200, friction: 30 }
  });

  return (
    <animated.group scale={scale}>
      <Points
        ref={pointsRef}
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
