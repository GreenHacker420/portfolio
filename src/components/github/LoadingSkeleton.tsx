'use client';

import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="p-4 rounded-lg bg-github-light/30 border border-github-border animate-pulse">
          <div className="h-4 w-24 bg-github-light/70 rounded mb-3" />
          <div className="h-7 w-20 bg-github-light/70 rounded" />
        </div>
      ))}
    </div>
  );
}

