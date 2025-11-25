'use client';

import { motion } from 'framer-motion';
import { Briefcase, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeader } from '@/components/ui/section-header';
import type { ExperienceItem } from '@/types/experience.d';
import { formatDate, formatPeriod } from './utils';

interface WorkExperienceTabProps {
  experiences: ExperienceItem[];
  expandedItem: string | null;
  onToggle: (id: string) => void;
  swipeDirection: 'left' | 'right' | null;
}

export function WorkExperienceTab({
  experiences,
  expandedItem,
  onToggle,
  swipeDirection,
}: WorkExperienceTabProps) {
  return (
    <motion.div
      key="work"
      initial={{ opacity: 0, x: swipeDirection === 'left' ? 50 : swipeDirection === 'right' ? -50 : 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: swipeDirection === 'left' ? -50 : 50 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <SectionHeader title="Work Experience" color="neon-green" />

      {experiences.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No work experience yet"
          description="Work experience will appear here once added."
          color="neon-green"
        />
      ) : (
        experiences.map((exp) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-github-light rounded-lg border border-github-border overflow-hidden transition-all duration-300 hover:border-neon-green/50"
          >
            <Collapsible
              open={expandedItem === exp.id}
              onOpenChange={() => onToggle(exp.id)}
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white text-base sm:text-lg leading-tight">
                      {exp.position}
                    </h4>
                    <p className="text-neon-green text-sm sm:text-base mt-0.5">
                      {exp.company}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-block text-github-text text-xs sm:text-sm bg-github-dark/50 px-2 py-1 rounded-full">
                      {formatPeriod(exp.startDate, exp.endDate)}
                    </span>
                  </div>
                </div>

                {exp.description && (
                  <CollapsibleTrigger className="mt-3 sm:mt-4 text-xs sm:text-sm text-github-text hover:text-white transition-colors flex items-center gap-1.5">
                    {expandedItem === exp.id ? 'Show less' : 'Show more'}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        expandedItem === exp.id ? 'rotate-180' : ''
                      }`}
                    />
                  </CollapsibleTrigger>
                )}
              </div>

              <CollapsibleContent>
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-github-border pt-3 sm:pt-4">
                  {exp.description && (
                    <p className="text-github-text text-sm sm:text-base leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </motion.div>
        ))
      )}
    </motion.div>
  );
}

export default WorkExperienceTab;
