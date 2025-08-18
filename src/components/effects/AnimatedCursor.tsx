
'use client';

import { useEffect, useState } from 'react';

const AnimatedCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof document === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 300);
    };

    const handleMouseEnter = () => {
      if (typeof document !== 'undefined') {
        document.body.style.cursor = 'none';
      }
    };

    const handleMouseLeave = () => {
      if (typeof document !== 'undefined') {
        document.body.style.cursor = 'auto';
      }
    };

    // Add hover detection for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a');

      setHovered(!!isInteractive);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      if (typeof document !== 'undefined') {
        document.body.style.cursor = 'auto';
      }
    };
  }, []);

  return (
    <>
      {/* Main cursor */}
      <div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-neon-green z-[9999] pointer-events-none transition-transform duration-100"
        style={{
          transform: `translate(${position.x - 16}px, ${position.y - 16}px) scale(${clicked ? 0.8 : hovered ? 1.5 : 1})`,
        }}
      />

      {/* Cursor dot */}
      <div
        className="fixed top-0 left-0 w-2 h-2 bg-neon-green rounded-full z-[10000] pointer-events-none transition-transform duration-75"
        style={{
          transform: `translate(${position.x - 4}px, ${position.y - 4}px)`,
          opacity: clicked ? 0.5 : 1,
        }}
      />
    </>
  );
};

export default AnimatedCursor;
