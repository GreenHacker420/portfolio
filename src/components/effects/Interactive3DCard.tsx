
import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

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
  
  // Motion values for rotation
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  
  // Smooth rotations with springs
  const springConfig = { stiffness: 150, damping: 20 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);
  
  // Transform for shadow and z-translation
  const shadowBlur = useTransform(
    [smoothRotateX, smoothRotateY],
    ([latestX, latestY]) => Math.sqrt(latestX * latestX + latestY * latestY) * 0.5
  );
  
  const zTranslate = useSpring(0, springConfig);
  
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
    
    rotateX.set(rotX);
    rotateY.set(rotY);
  };
  
  // Handle mouse enter/leave
  const handleMouseEnter = () => {
    setIsHovered(true);
    zTranslate.set(depth);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    zTranslate.set(0);
  };
  
  // Clean up effect when component unmounts
  useEffect(() => {
    return () => {
      rotateX.set(0);
      rotateY.set(0);
      zTranslate.set(0);
    };
  }, [rotateX, rotateY, zTranslate]);
  
  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        style={{
          rotateX: smoothRotateX,
          rotateY: smoothRotateY,
          z: zTranslate,
          boxShadow: useTransform(
            shadowBlur,
            (blur) => `0 ${blur * 2}px ${blur * 4}px ${shadowColor}`
          ),
          transformStyle: "preserve-3d",
        }}
        className="h-full w-full transition-colors duration-300"
      >
        {children}
        
        {/* Visual effect for edges */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none border border-neon-green"
          style={{
            opacity: useTransform(zTranslate, [0, depth], [0, 0.3]),
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Interactive3DCard;
