
'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ThreeFallback from './ThreeFallback';

// Lazy load React Three Fiber components
const Canvas = React.lazy(() => 
  import('@react-three/fiber').then((mod) => ({ default: mod.Canvas }))
);

const InteractiveThreeScene = React.lazy(() => 
  import('../../3d/InteractiveThreeScene')
);

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
          >
            <InteractiveThreeScene />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default ThreeDBackground;
