
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring } from '@react-spring/three';

const ParticlesCanvas = ({ color = '#3fb950', count = 2000 }) => {
  const ref = useRef<THREE.Points>(null!);
  
  const [springs, api] = useSpring(() => ({
    scale: 1,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    config: { mass: 2, tension: 200, friction: 50 },
  }));

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      temp[i3] = (Math.random() - 0.5) * 12;
      temp[i3 + 1] = (Math.random() - 0.5) * 12;
      temp[i3 + 2] = (Math.random() - 0.5) * 12;
    }
    return temp;
  }, [count]);

  const handleMouseMove = (event: MouseEvent) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = (event.clientY / window.innerHeight) * 2 - 1;
    
    api.start({
      rotation: [y * 0.5, x * 0.5, 0],
    });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x += 0.0005;
    ref.current.rotation.y += 0.0007;
  });

  return (
    <Points
      ref={ref}
      positions={particles}
      stride={3}
      frustumCulled={false}
      {...springs}
    >
      <PointMaterial
        transparent
        color={color}
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
};

export default ParticlesCanvas;
