'use client';

import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';

export default function Scene({ children, className, ...props }) {
    return (
        <Canvas
            className={className}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            camera={{ position: [0, 0, 5], fov: 50 }}
            {...props}
        >
            {children}
            <Preload all />
        </Canvas>
    );
}
