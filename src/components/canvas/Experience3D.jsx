'use client';
import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

function TimelineItem({ item, index, ...props }) {
    const ref = useRef();
    const scroll = useScroll();
    const { height } = useThree((state) => state.viewport);

    useFrame(() => {
        // Calculate position based on scroll
        // Items appear one by one
        const offset = index * 0.25;
        const visible = scroll.range(offset, 0.25);

        // Animate opacity/scale based on visibility
        if (ref.current) {
            // Vertical parallax
            // ref.current.position.y = (1 - scroll.offset * totalItems) * 10; 
            // Simple approach: standard HTML overlay controlled by scroll or 3D objects
        }
    });

    return (
        <group {...props}>
            {/* We use Html from drei to render crisp text mixed with 3D */}
            <Html
                transform
                position={[index % 2 === 0 ? -1.5 : 1.5, 0, 0]} // Zig-zag layout
                style={{ width: '400px', pointerEvents: 'none' }}
            >
                <div className={`p-6 rounded-2xl border border-white/10 backdrop-blur-md transition-all duration-500 bg-neutral-900/80`}>
                    <h3 className="text-2xl font-bold text-neon-green">{item.position}</h3>
                    <p className="text-xl text-white">{item.company}</p>
                    <div className="text-neutral-400 font-mono text-sm mt-1">
                        {new Date(item.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - {item.endDate ? new Date(item.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present'}
                    </div>
                    <p className="text-neutral-300 mt-4 leading-relaxed text-sm">
                        {item.description}
                    </p>
                </div>
            </Html>

            {/* Decorative 3D marker */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.2, 32, 32]} />
                <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={2} />
            </mesh>

            {/* Connecting Line segment - visuals handled by parent usually or just separate objects */}
        </group>
    );
}

function ExperienceScene({ data }) {
    const scroll = useScroll();

    useFrame((state) => {
        // Move the whole group up as we scroll
        // The scroll.offset goes from 0 to 1
        // We want to scroll through all items.
        // Let's say we have N items, and we space them by Y units.
        // layout:
        // Item 0 at Y=0
        // Item 1 at Y=-4
        // Item 2 at Y=-8
        // Total Height = N * 4
        // Camera stays at 0.
        // Group moves from 0 to (N-1)*4 + padding

        // Use scroll.offset to drive group Y position
        // state.camera.position.y = -scroll.offset * (data.length * 4); // Move camera down instead?
    });

    return (
        <group>
            {data.map((item, i) => (
                <TimelineItem
                    key={i}
                    item={item}
                    index={i}
                    position={[0, -i * 5, 0]} // Vertical spacing
                />
            ))}
            {/* Center Line */}
            <mesh position={[0, -((data.length - 1) * 5) / 2, -0.5]}>
                <boxGeometry args={[0.05, data.length * 5, 0.05]} />
                <meshStandardMaterial color="#333" />
            </mesh>
        </group>
    );
}
// Separate component to handle camera movement via scroll
function CameraController({ totalHeight }) {
    const scroll = useScroll();
    useFrame((state) => {
        // Move camera down
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, -scroll.offset * totalHeight, 0.1);
    });
    return null;
}

export default function Experience3D({ data }) {
    const gap = 5;
    const totalHeight = (data.length - 1) * gap;

    return (
        <div className="h-[80rem] w-full relative">
            <Canvas camera={{ position: [0, 2, 8], fov: 40 }}>
                <fog attach="fog" args={['#000', 5, 20]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />

                {/* Pages roughly based on items * gap / viewport factor */}
                <ScrollControls pages={data.length} damping={0.4}>
                    <ExperienceScene data={data} />
                    <CameraController totalHeight={totalHeight} />
                </ScrollControls>
            </Canvas>

            <div className="absolute top-10 left-0 w-full text-center pointer-events-none">
                <h2 className="text-3xl md:text-5xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">Career Journey</h2>
                <p className="text-neutral-400 mt-2">Scroll to explore</p>
            </div>
        </div>
    );
}
