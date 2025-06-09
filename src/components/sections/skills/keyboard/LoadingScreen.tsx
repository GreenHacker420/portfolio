
'use client';

/**
 * Loading screen component for 3D scene
 */
const LoadingScreen = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-github-dark/90 backdrop-blur-sm z-10">
      <div className="relative mb-6">
        <div className="w-20 h-20 border-4 border-neon-green/30 border-t-neon-green rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-neon-green/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <div className="text-center">
        <p className="text-white text-xl font-semibold mb-2">Loading 3D Keyboard</p>
        <p className="text-github-text text-sm">Click on keys to explore my skills</p>
      </div>
      <div className="mt-6 flex space-x-1">
        <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
