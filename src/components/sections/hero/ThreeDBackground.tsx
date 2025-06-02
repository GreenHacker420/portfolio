
'use client';

import React, { useEffect, useState } from 'react';
import ThreeFallback from './ThreeFallback';

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

  // Temporarily disable 3D canvas due to React Three Fiber compatibility issues
  // Show fallback background instead
  return <ThreeFallback />;
};

export default ThreeDBackground;
