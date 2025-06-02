
'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const ReactiveBackground = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 50, damping: 50 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Get container dimensions
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      // Calculate mouse position relative to container center (in -1 to 1 range)
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const relativeX = (e.clientX - centerX) / (rect.width / 2);
      const relativeY = (e.clientY - centerY) / (rect.height / 2);

      mouseX.set(relativeX * 10); // Adjust sensitivity
      mouseY.set(relativeY * 10);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          translateX: springX,
          translateY: springY,
        }}
      >
        <div className="absolute top-0 -left-4 w-[50vw] h-[50vw] bg-neon-purple rounded-full mix-blend-screen filter blur-[100px] opacity-70"></div>
        <div className="absolute top-[30%] -right-[10%] w-[40vw] h-[40vw] bg-neon-green rounded-full mix-blend-screen filter blur-[100px] opacity-70"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] bg-neon-blue rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>
      </motion.div>
    </div>
  );
};

export default ReactiveBackground;
