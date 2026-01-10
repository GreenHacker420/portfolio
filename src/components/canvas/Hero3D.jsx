'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, ContactShadows, Environment } from '@react-three/drei';

function Geometries() {
    const meshRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.x = t * 0.2;
            meshRef.current.rotation.y = t * 0.3;
        }
    });

    return (
        <group>
            <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
                <mesh ref={meshRef} position={[2, 0, 0]} scale={1.2}>
                    <icosahedronGeometry args={[1, 15]} />
                    <MeshDistortMaterial
                        color="#39ff14"
                        envMapIntensity={1}
                        clearcoat={1}
                        clearcoatRoughness={0}
                        metalness={0.5}
                        distort={0.4}
                        speed={2}
                    />
                </mesh>
            </Float>

            <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2} position={[-2, -1, -1]}>
                <mesh scale={0.8}>
                    <torusGeometry args={[1, 0.3, 16, 100]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        roughness={0.1}
                        metalness={0.8}
                    />
                </mesh>
            </Float>

            <ContactShadows
                resolution={1024}
                scale={20}
                blur={2}
                opacity={0.5}
                far={10}
                color="#39ff14"
            />
        </group>
    );
}

export default function Hero3D() {
    return (
        <>
            <Geometries />
            <Environment preset="city" />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
        </>
    );
}
