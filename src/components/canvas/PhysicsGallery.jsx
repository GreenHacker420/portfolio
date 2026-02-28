'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider, InstancedRigidBodies } from '@react-three/rapier';
import { Environment, Text, useTexture, RoundedBox } from '@react-three/drei';
import { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';

// A single physical project block
function ProjectBlock({ project, position, onClick, index }) {
    const api = useRef();
    const [hovered, setHovered] = useState(false);

    // Give each block a slight random rotation
    const rotation = useMemo(() => [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    ], []);

    // Pointer interaction: apply an impulse when clicked/dragged
    const handlePointerDown = (e) => {
        e.stopPropagation();
        if (api.current) {
            // Give it a kick upwards and sideways
            api.current.applyImpulse({
                x: (Math.random() - 0.5) * 50,
                y: 50 + Math.random() * 50,
                z: (Math.random() - 0.5) * 50
            }, true);

            // Apply some random torque for spinning
            api.current.applyTorqueImpulse({
                x: (Math.random() - 0.5) * 20,
                y: (Math.random() - 0.5) * 20,
                z: (Math.random() - 0.5) * 20
            }, true);
        }

        // Trigger the actual onClick for the modal after a tiny delay 
        // if we want it to open, but maybe we only want to throw it?
        // Let's pass the click to open the modal!
        onClick(project);
    };

    return (
        <RigidBody
            ref={api}
            position={position}
            rotation={rotation}
            colliders="cuboid"
            restitution={0.7} // Bounciness
            friction={0.2}
            mass={1}
            linearDamping={0.5}
            angularDamping={0.5}
        >
            <group
                onPointerDown={handlePointerDown}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <RoundedBox args={[3, 4, 0.5]} radius={0.1} smoothness={4}>
                    <meshStandardMaterial
                        color={hovered ? "#4f46e5" : "#171717"} // Indigo on hover, dark gray otherwise
                        metalness={0.8}
                        roughness={0.2}
                        envMapIntensity={1}
                        transparent
                        opacity={0.9}
                    />
                </RoundedBox>

                {/* Project Title Text mapped onto the box */}
                <Text
                    position={[0, 0, 0.26]}
                    fontSize={0.4}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={2.5}
                    textAlign="center"
                    font="/fonts/Inter-Bold.woff" // Fallback if not available
                >
                    {project.title.split(' — ')[0] || project.title}
                </Text>
            </group>
        </RigidBody>
    );
}

// Bounding box to hold the items
function Bounds() {
    return (
        <RigidBody type="fixed" restitution={0.5} friction={0.1}>
            {/* Floor */}
            <CuboidCollider position={[0, -10, 0]} args={[20, 1, 20]} />
            {/* Walls */}
            <CuboidCollider position={[-15, 0, 0]} args={[1, 20, 20]} />
            <CuboidCollider position={[15, 0, 0]} args={[1, 20, 20]} />
            <CuboidCollider position={[0, 0, -5]} args={[20, 20, 1]} />
            {/* Ceiling (optional, but keeps them from flying away) */}
            <CuboidCollider position={[0, 20, 0]} args={[20, 1, 20]} />
            {/* Front glass (invisible barrier so they don't fall into the camera) */}
            <CuboidCollider position={[0, 0, 5]} args={[20, 20, 1]} />
        </RigidBody>
    );
}

// Invisible sphere that follows the mouse to push objects away
function Pointer() {
    const api = useRef();
    useFrame(({ pointer, viewport }) => {
        if (api.current) {
            api.current.setNextKinematicTranslation({
                x: (pointer.x * viewport.width) / 2,
                y: (pointer.y * viewport.height) / 2,
                z: 0
            });
        }
    });

    return (
        <RigidBody position={[0, 0, 0]} type="kinematicPosition" colliders="ball" ref={api}>
            <mesh>
                <sphereGeometry args={[1.5, 32, 32]} />
                <meshBasicMaterial transparent opacity={0.0} /> {/* Invisible */}
            </mesh>
        </RigidBody>
    );
}

export function PhysicsGallery({ projects, onProjectClick }) {
    return (
        <div className="w-full h-[70vh] relative overflow-hidden bg-black cursor-grab active:cursor-grabbing border-b border-white/10">
            {/* Overlay Text */}
            <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-center p-8 text-center">
                <h2 className="text-4xl md:text-7xl font-bold text-white/10 select-none uppercase tracking-[0.2em]">
                    Gravity Gallery
                </h2>
                <p className="text-white/30 tracking-widest text-sm mt-4 select-none">
                    CLICK & THROW PROJECTS
                </p>
            </div>

            <Canvas
                shadows
                camera={{ position: [0, 0, 15], fov: 40 }}
                gl={{ alpha: false, antialias: true }}
                dpr={[1, 2]}
            >
                <color attach="background" args={["#000000"]} />
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
                <Environment preset="city" />

                <Physics gravity={[0, -20, 0]}>
                    <Pointer />
                    <Bounds />

                    {projects.map((project, i) => (
                        <ProjectBlock
                            key={project.id || i}
                            project={project}
                            index={i}
                            position={[
                                (Math.random() - 0.5) * 10,
                                10 + i * 2, // Drop from top
                                (Math.random() - 0.5) * 2
                            ]}
                            onClick={onProjectClick}
                        />
                    ))}
                </Physics>
            </Canvas>
        </div>
    );
}
