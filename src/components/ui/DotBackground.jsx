
'use client';
import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

export function DotBackground({ children, className }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth out the mouse movement
    const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            // Normalized coordinates -0.5 to 0.5
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth) - 0.5;
            const y = (e.clientY / innerHeight) - 0.5;

            mouseX.set(x * 50); // Move background slightly (25px max)
            mouseY.set(y * 50);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    // SVG for the dot pattern
    const dotSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="2" cy="2" r="1.5" fill="#444444" fill-opacity="0.3" />
    </svg>
  `;
    const encodedDotSvg = `data:image/svg+xml;utf8,${encodeURIComponent(dotSvg)}`;

    return (
        <div className={`relative w-full min-h-screen ${className}`}>

            {/* Fixed Background Layer */}
            <motion.div
                className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center bg-black"
                style={{
                    x: smoothX,
                    y: smoothY
                }}
            >
                <div
                    className="absolute inset-[-100px] w-[calc(100%+200px)] h-[calc(100%+200px)] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"
                    style={{
                        backgroundImage: `url('${encodedDotSvg}')`,
                        backgroundSize: '24px 24px',
                        backgroundRepeat: 'repeat',
                    }}
                />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
}

export function GridBackground({ children, className }) {
    // Keeping GridBackground simple for now or can be removed if unused
    return null;
}
