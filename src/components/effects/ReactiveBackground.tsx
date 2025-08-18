
'use client';

import { useEffect, useRef } from 'react';

const ReactiveBackground = () => {
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const relativeX = (e.clientX - centerX) / (rect.width / 2);
      const relativeY = (e.clientY - centerY) / (rect.height / 2);
      target.current.x = relativeX * 10; // sensitivity
      target.current.y = relativeY * 10;
    };

    const animate = () => {
      // simple spring-ish lerp
      pos.current.x += (target.current.x - pos.current.x) * 0.08;
      pos.current.y += (target.current.y - pos.current.y) * 0.08;
      if (containerRef.current) {
        containerRef.current.style.setProperty('--rx', String(pos.current.x));
        containerRef.current.style.setProperty('--ry', String(pos.current.y));
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{ transform: `translate(var(--rx, 0px), var(--ry, 0px))` }}
      >
        <div className="absolute top-0 -left-4 w-[50vw] h-[50vw] bg-neon-purple rounded-full mix-blend-screen filter blur-[100px] opacity-70"></div>
        <div className="absolute top-[30%] -right-[10%] w-[40vw] h-[40vw] bg-neon-green rounded-full mix-blend-screen filter blur-[100px] opacity-70"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] bg-neon-blue rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>
      </div>
    </div>
  );
};

export default ReactiveBackground;
