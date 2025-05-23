
import { Html } from '@react-three/drei';

/**
 * Loading screen component for 3D scene
 */
const LoadingScreen = () => {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-neon-green border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white text-lg">Loading Keyboard...</p>
      </div>
    </Html>
  );
};

export default LoadingScreen;
