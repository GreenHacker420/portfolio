
'use client';

/**
 * Loading screen component for 3D scene
 */
const LoadingScreen = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-github-dark/80 backdrop-blur-sm z-10">
      <div className="w-16 h-16 border-4 border-neon-green border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-white text-lg">Loading Keyboard...</p>
    </div>
  );
};

export default LoadingScreen;
