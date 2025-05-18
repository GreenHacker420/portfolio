
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls } from '@react-three/drei';
import ParticlesCanvas from './ParticlesCanvas';
import HexagonModel from './HexagonModel';

interface ThreeSceneProps {
  showParticles?: boolean;
  showHexagon?: boolean;
}

const ThreeScene = ({ 
  showParticles = true, 
  showHexagon = true 
}: ThreeSceneProps) => {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
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
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ThreeScene;
