
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ThreeFallback from './ThreeFallback';

// Dynamically import ThreeScene to prevent it from crashing the whole app
const ThreeScene = React.lazy(() => import('../../3d/ThreeScene'));

interface ThreeDBackgroundProps {
  mounted: boolean;
}

const ThreeDBackground = ({ mounted }: ThreeDBackgroundProps) => {
  return (
    <div className="absolute inset-0 z-0">
      <ErrorBoundary fallback={<ThreeFallback />}>
        <Suspense fallback={<ThreeFallback />}>
          {mounted && <ThreeScene showParticles={true} showHexagon={true} />}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default ThreeDBackground;
