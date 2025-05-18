
import { Canvas } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import ParticlesCanvas from './ParticlesCanvas';
import HexagonModel from './HexagonModel';
import { motion } from 'framer-motion';

interface ThreeSceneProps {
  showParticles?: boolean;
  showHexagon?: boolean;
}

const ThreeScene = ({ 
  showParticles = true, 
  showHexagon = true 
}: ThreeSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div 
      className="canvas-container absolute inset-0 z-0"
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]} // Optimize performance by limiting pixel ratio
        style={{ background: 'transparent' }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#bf4dff" />
          
          {showHexagon && <HexagonModel />}
          {showParticles && <ParticlesCanvas />}
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            maxPolarAngle={Math.PI / 2} 
            minPolarAngle={Math.PI / 3}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
      
      {/* Gradient overlay to blend with rest of the site */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-github-darker opacity-70 pointer-events-none"></div>
    </motion.div>
  );
};

export default ThreeScene;
