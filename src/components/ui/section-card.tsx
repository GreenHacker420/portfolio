'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  hoverColor?: 'neon-green' | 'neon-purple' | 'neon-blue' | 'neon-pink';
  onClick?: () => void;
}

const hoverColorMap = {
  'neon-green': 'hover:border-neon-green/50',
  'neon-purple': 'hover:border-neon-purple/50',
  'neon-blue': 'hover:border-neon-blue/50',
  'neon-pink': 'hover:border-neon-pink/50',
};

const shadowColorMap = {
  'neon-green': '0 10px 25px -5px rgba(63, 185, 80, 0.2)',
  'neon-purple': '0 10px 25px -5px rgba(191, 77, 255, 0.2)',
  'neon-blue': '0 10px 25px -5px rgba(31, 111, 235, 0.2)',
  'neon-pink': '0 10px 25px -5px rgba(247, 120, 186, 0.2)',
};

export function SectionCard({
  children,
  className,
  hoverable = true,
  hoverColor = 'neon-green',
  onClick,
}: SectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={
        hoverable
          ? { y: -5, boxShadow: shadowColorMap[hoverColor] }
          : undefined
      }
      onClick={onClick}
      className={cn(
        'bg-github-light rounded-lg border border-github-border overflow-hidden transition-all duration-300',
        hoverable && hoverColorMap[hoverColor],
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export default SectionCard;
