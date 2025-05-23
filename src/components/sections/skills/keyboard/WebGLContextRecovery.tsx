
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

/**
 * Component that helps recover from WebGL context loss
 */
const WebGLContextRecovery = () => {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLoss = (event: Event) => {
      event.preventDefault();
      console.warn('WebGL context loss detected in recovery component');
    };
    canvas.addEventListener('webglcontextlost', handleContextLoss);
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLoss);
    };
  }, [gl]);

  return null;
};

export default WebGLContextRecovery;
