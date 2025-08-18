'use client';

import dynamic from 'next/dynamic';

// Export a client-only Spline component using next/dynamic
const C = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => null,
});

export default C;

