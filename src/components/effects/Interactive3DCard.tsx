
'use client';

import { useState, useRef, useEffect } from 'react';

interface Interactive3DCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  shadowColor?: string;
}

const Interactive3DCard = ({
  children,
  className = "",
  depth = 20,
  shadowColor = "rgba(63, 185, 80, 0.4)",
}: Interactive3DCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Internal state for rotation/translation
  const rotation = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const zTranslate = useRef(0);
  const rafRef = useRef<number | null>(null);
  const shadowRef = useRef(0);

  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate rotation based on mouse position
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Convert to rotation values (-15 to 15 degrees)
    const rotX = (mouseY / (rect.height / 2)) * -10;
    const rotY = (mouseX / (rect.width / 2)) * 10;
    targetRotation.current.x = rotX;
    targetRotation.current.y = rotY;
  };

  // Handle mouse enter/leave
  const handleMouseEnter = () => {
    setIsHovered(true);
    zTranslate.current = depth;
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    targetRotation.current.x = 0;
    targetRotation.current.y = 0;
    zTranslate.current = 0;
  };

  // Clean up effect when component unmounts
  useEffect(() => {
    const animate = () => {
      // spring-ish lerp
      rotation.current.x += (targetRotation.current.x - rotation.current.x) * 0.15;
      rotation.current.y += (targetRotation.current.y - rotation.current.y) * 0.15;
      shadowRef.current = Math.sqrt(rotation.current.x ** 2 + rotation.current.y ** 2) * 0.5;
      if (cardRef.current) {
        cardRef.current.style.setProperty('--rx', `${rotation.current.x}`);
        cardRef.current.style.setProperty('--ry', `${rotation.current.y}`);
        cardRef.current.style.setProperty('--rz', `${zTranslate.current}`);
        cardRef.current.style.setProperty('--shadow', `${shadowRef.current}`);
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        style={{
          transform: `rotateX(var(--rx, 0)) rotateY(var(--ry, 0)) translateZ(var(--rz, 0px))`,
          boxShadow: `0 ${Number((shadowRef.current * 2).toFixed(2))}px ${Number((shadowRef.current * 4).toFixed(2))}px ${shadowColor}`,
          transformStyle: "preserve-3d",
          transition: isHovered ? 'transform 60ms ease-out' : 'transform 200ms ease-out'
        }}
        className="h-full w-full transition-colors duration-300"
      >
        {children}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none border border-neon-green"
          style={{ opacity: zTranslate.current ? 0.3 : 0 }}
        />
      </div>
    </div>
  );
};

export default Interactive3DCard;
