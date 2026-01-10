'use client';
import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Image, Environment, ScrollControls, useScroll, Text } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';
import { useRouter } from 'next/navigation';

function Card({ url, title, description, position, rotation, index, ...props }) {
    const ref = useRef();
    const [hovered, hover] = useState(false);
    const router = useRouter();

    useFrame((state, delta) => {
        if (!ref.current) return;

        // Smooth hover animation
        const targetScale = hovered ? 1.2 : 1;
        easing.damp3(ref.current.scale, [targetScale, targetScale, targetScale], 0.15, delta);

        if (ref.current.material) {
            easing.damp(ref.current.material, 'radius', hovered ? 0.1 : 0.01, 0.2, delta);
            easing.damp(ref.current.material, 'zoom', hovered ? 1 : 1.2, 0.2, delta);
        }

        // Subtle float
        ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + index * 100) * 0.1;
    });

    return (
        <group {...props}>
            <Image
                ref={ref}
                url={url}
                transparent
                side={THREE.DoubleSide}
                position={position}
                rotation={rotation}
                scale={[3, 2]}
                onPointerOver={() => { hover(true); document.body.style.cursor = 'pointer'; }}
                onPointerOut={() => { hover(false); document.body.style.cursor = 'auto'; }}
                onClick={() => router.push(`/projects/${index}`)} // Placeholder link
            >
                <planeGeometry />
            </Image>
            {/* Simple Text Overlay in 3D Space if needed, currently clean look */}
            {hovered && (
                <Text position={[position[0], position[1] - 1.2, position[2] + 0.1]} fontSize={0.2} color="white" anchorX="center" anchorY="top">
                    {title}
                </Text>
            )}
        </group>
    );
}

function Gallery({ data }) {
    const { width } = useThree((state) => state.viewport);

    // Responsive layout logic could go here

    // Memoize random layout to prevent re-calculation on every render
    const positions = useMemo(() => {
        return data.map((_, i) => [
            (i - 1.5) * 3.5 + (Math.random() - 0.5), // Scatter X
            (Math.random() - 0.5) * 2, // Scatter Y
            (Math.random() - 0.5) // Slight depth variation
        ]);
    }, [data]);

    const rotations = useMemo(() => {
        return data.map(() => [0, (Math.random() - 0.5) * 0.2, 0]);
    }, [data]);

    return (
        <group>
            {data.map((project, i) => (
                <Card
                    key={i}
                    index={i}
                    url={(project.imageUrl && !project.imageUrl.startsWith('/projects/')) ? project.imageUrl : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"}
                    title={project.title}
                    description={project.description}
                    position={positions[i]}
                    rotation={rotations[i]}
                />
            ))}
        </group>
    );
}

export default function FloatingProjects({ data }) {
    return (
        <div className="h-[60rem] w-full relative">
            {/* 3D Canvas */}
            <Canvas camera={{ position: [0, 0, 10], fov: 30 }}>
                <fog attach="fog" args={['#000', 8, 25]} />
                <ScrollControls pages={2} damping={0.3}>
                    <Gallery data={data} />
                </ScrollControls>
                <Environment preset="city" />
            </Canvas>

            {/* HTML Overlay Title */}
            <div className="absolute top-10 left-0 w-full text-center pointer-events-none">
                <h2 className="text-3xl md:text-5xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">Featured Projects</h2>
                <p className="text-neutral-400 mt-2">Explore the 3D Gallery</p>
            </div>
        </div>
    );
}
