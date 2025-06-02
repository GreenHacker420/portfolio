
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ThreeFallback from './ThreeFallback';
import { Canvas } from '@react-three/fiber';

// Dynamically import components to prevent them from crashing the whole app
const InteractiveThreeScene = React.lazy(() => import('../../3d/InteractiveThreeScene'));

interface ThreeDBackgroundProps {
  mounted: boolean;
}

const ThreeDBackground = ({ mounted }: ThreeDBackgroundProps) => {
  return (
    <div className="absolute inset-0 z-0">
      <ErrorBoundary 
        fallback={<ThreeFallback />}
        onError={(error, errorInfo) => {
          console.error('3D Background Error:', error, errorInfo);
        }}
      >
        <Suspense fallback={<ThreeFallback />}>
          {mounted && (
            <Canvas 
              camera={{ position: [0, 0, 6], fov: 50 }}
              dpr={[1, 2]} // Optimize performance by limiting pixel ratio
              style={{ background: 'transparent' }}
              gl={{ 
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
                preserveDrawingBuffer: false,
                failIfMajorPerformanceCaveat: false
              }}
              onCreated={({ gl }) => {
                // Ensure WebGL context is properly initialized
                gl.setClearColor(0x000000, 0);
                console.log('3D Canvas initialized successfully');
              }}
              onError={(error) => {
                console.error('Canvas error:', error);
              }}
            >
              <InteractiveThreeScene />
            </Canvas>
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default ThreeDBackground;
