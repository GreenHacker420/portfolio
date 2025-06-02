
'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ThreeFallback from './ThreeFallback';
import dynamic from 'next/dynamic';

// Dynamically import Canvas with no SSR to prevent React version conflicts
const Canvas = dynamic(
  () => import('@react-three/fiber').then((mod) => ({ default: mod.Canvas })),
  { 
    ssr: false,
    loading: () => <ThreeFallback />
  }
);

// Dynamically import InteractiveThreeScene with no SSR
const InteractiveThreeScene = dynamic(() => import('../../3d/InteractiveThreeScene'), {
  ssr: false,
  loading: () => <ThreeFallback />
});

interface ThreeDBackgroundProps {
  mounted: boolean;
}

const ThreeDBackground = ({ mounted }: ThreeDBackgroundProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything on server side
  if (!isClient || !mounted) {
    return <ThreeFallback />;
  }

  return (
    <div className="absolute inset-0 z-0">
      <ErrorBoundary
        fallback={<ThreeFallback />}
        onError={(error, errorInfo) => {
          console.error('3D Background Error:', error, errorInfo);
        }}
      >
        <Suspense fallback={<ThreeFallback />}>
          <Canvas
            camera={{ position: [0, 0, 6], fov: 50 }}
            dpr={[1, 2]}
            style={{ background: 'transparent' }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
              preserveDrawingBuffer: false,
              failIfMajorPerformanceCaveat: false
            }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
              console.log('3D Canvas initialized successfully');
            }}
            onError={(error) => {
              console.error('Canvas error:', error);
            }}
          >
            <InteractiveThreeScene />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default ThreeDBackground;
