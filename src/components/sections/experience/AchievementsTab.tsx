'use client';

import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeader } from '@/components/ui/section-header';
import type { AchievementItem } from '@/types/experience.d';
import { formatDate } from './utils';

interface AchievementsTabProps {
  achievements: AchievementItem[];
  swipeDirection: 'left' | 'right' | null;
}

export function AchievementsTab({
  achievements,
  swipeDirection,
}: AchievementsTabProps) {
  return (
    <motion.div
      key="achievements"
      initial={{ opacity: 0, x: swipeDirection === 'left' ? 50 : swipeDirection === 'right' ? -50 : 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: swipeDirection === 'left' ? -50 : 50 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <SectionHeader title="Achievements" color="neon-green" />

      {achievements.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No achievements yet"
          description="Achievements will appear here once added."
          color="neon-green"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(63, 185, 80, 0.2)' }}
              className="bg-github-light rounded-lg p-4 sm:p-6 border border-github-border hover:border-neon-green/50 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <h4 className="font-semibold text-white text-base sm:text-lg leading-tight flex-1">
                  {achievement.title}
                </h4>
                <span className="bg-github-dark text-neon-green px-2 py-1 text-xs rounded-full whitespace-nowrap self-start">
                  {formatDate(achievement.date)}
                </span>
              </div>
              {achievement.description && (
                <p className="mt-3 text-github-text text-sm sm:text-base leading-relaxed">
                  {achievement.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default AchievementsTab;
