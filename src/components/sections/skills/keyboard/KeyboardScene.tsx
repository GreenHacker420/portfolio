
import React from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
} from '@react-three/drei';
import { Suspense } from 'react';
import { KeyboardTheme } from './KeyboardThemes';
import WebGLContextRecovery from './WebGLContextRecovery';
import LoadingScreen from './LoadingScreen';
import KeyboardComponent from './KeyboardComponent';

interface KeyboardSceneProps {
  onSelectKey: (key: string) => void;
  selectedKey: string | null;
  theme: KeyboardTheme;
  performanceMode: boolean;
}

/**
 * 3D scene component that renders the keyboard
 */
const KeyboardScene = ({
  onSelectKey,
  selectedKey,
  theme,
  performanceMode
}: KeyboardSceneProps) => {
  return (
    <Canvas
      camera={{ position: [0, 4, 10], fov: 45 }}
      dpr={performanceMode ? 1 : [1, 2]}
      style={{ background: 'transparent' }}
      gl={{
        antialias: !performanceMode,
        alpha: true,
        powerPreference: 'high-performance'
      }}
    >
      <Suspense fallback={<LoadingScreen />}>
        {/* WebGL context recovery component */}
        <WebGLContextRecovery />

        {/* Optimized lighting based on performance mode */}
        {/* @ts-ignore */}
        <ambientLight intensity={0.6} color="#ffffff" />
        {/* @ts-ignore */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.0}
          color="#ffffff"
          castShadow={!performanceMode}
        />

        {/* Environment for reflections */}
        <Environment preset="studio" />

        {/* Keyboard with error handling */}
        <KeyboardComponent
          onSelectKey={onSelectKey}
          selectedKey={selectedKey}
          theme={theme}
          performanceMode={performanceMode}
        />

        {/* Shadows */}
        {!performanceMode && (
          <ContactShadows
            position={[0, -0.5, 0]}
            opacity={0.5}
            scale={20}
            blur={1.5}
            far={1}
          />
        )}

        {/* Camera controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          rotateSpeed={0.3}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          maxAzimuthAngle={Math.PI / 4}
          minAzimuthAngle={-Math.PI / 4}
          dampingFactor={0.1}
          enableDamping={true}
          autoRotate={false}
        />
      </Suspense>
    </Canvas>
  );
};

export default KeyboardScene;
