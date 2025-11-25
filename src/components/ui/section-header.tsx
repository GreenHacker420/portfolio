'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  color?: 'neon-green' | 'neon-purple' | 'neon-blue' | 'neon-pink';
  className?: string;
  showDot?: boolean;
}

const colorMap = {
  'neon-green': 'bg-neon-green',
  'neon-purple': 'bg-neon-purple',
  'neon-blue': 'bg-neon-blue',
  'neon-pink': 'bg-neon-pink',
};

export function SectionHeader({
  title,
  subtitle,
  color = 'neon-green',
  className,
  showDot = true,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('mb-4', className)}
    >
      <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
        {showDot && (
          <span
            className={cn(
              'inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mr-2',
              colorMap[color]
            )}
          />
        )}
        {title}
      </h3>
      {subtitle && (
        <p className="text-github-text text-sm mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
}

export default SectionHeader;
