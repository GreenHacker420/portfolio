'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: 'neon-green' | 'neon-purple' | 'neon-blue' | 'neon-pink';
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const colorMap = {
  'neon-green': {
    bg: 'rgba(63, 185, 80, 0.1)',
    text: '#3fb950',
  },
  'neon-purple': {
    bg: 'rgba(191, 77, 255, 0.1)',
    text: '#bf4dff',
  },
  'neon-blue': {
    bg: 'rgba(31, 111, 235, 0.1)',
    text: '#1f6feb',
  },
  'neon-pink': {
    bg: 'rgba(247, 120, 186, 0.1)',
    text: '#f778ba',
  },
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  color = 'neon-green',
  action,
  className,
}: EmptyStateProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: colors.bg }}
      >
        <Icon className="w-8 h-8" style={{ color: colors.text }} />
      </div>
      <h4 className="text-white font-medium text-lg mb-2">{title}</h4>
      <p className="text-github-text text-sm max-w-xs">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 text-sm font-medium rounded-lg transition-all"
          style={{
            color: colors.text,
            border: `1px solid ${colors.text}`,
          }}
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}

export default EmptyState;
