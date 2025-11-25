'use client';

import { motion } from 'framer-motion';
import { GraduationCap, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeader } from '@/components/ui/section-header';
import type { EducationItem } from '@/types/experience.d';
import { formatPeriod } from './utils';

interface EducationTabProps {
  education: EducationItem[];
  expandedItem: string | null;
  onToggle: (id: string) => void;
  swipeDirection: 'left' | 'right' | null;
}

export function EducationTab({
  education,
  expandedItem,
  onToggle,
  swipeDirection,
}: EducationTabProps) {
  return (
    <motion.div
      key="education"
      initial={{ opacity: 0, x: swipeDirection === 'left' ? 50 : swipeDirection === 'right' ? -50 : 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: swipeDirection === 'left' ? -50 : 50 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <SectionHeader title="Education" color="neon-purple" />

      {education.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No education records"
          description="Education history will appear here once added."
          color="neon-purple"
        />
      ) : (
        education.map((edu) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-github-light rounded-lg border border-github-border overflow-hidden hover:border-neon-purple/50 transition-colors"
          >
            <Collapsible
              open={expandedItem === edu.id}
              onOpenChange={() => onToggle(edu.id)}
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white text-base sm:text-lg leading-tight">
                      {edu.institution}
                    </h4>
                    <p className="text-neon-purple text-sm sm:text-base mt-0.5">
                      {edu.degree}
                      {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-block text-github-text text-xs sm:text-sm bg-github-dark/50 px-2 py-1 rounded-full">
                      {formatPeriod(edu.startDate, edu.endDate)}
                    </span>
                  </div>
                </div>

                {(edu.gpa || edu.honors) && (
                  <CollapsibleTrigger className="mt-3 sm:mt-4 text-xs sm:text-sm text-github-text hover:text-white transition-colors flex items-center gap-1.5">
                    {expandedItem === edu.id ? 'Show less' : 'Show more'}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        expandedItem === edu.id ? 'rotate-180' : ''
                      }`}
                    />
                  </CollapsibleTrigger>
                )}
              </div>

              <CollapsibleContent>
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-github-border pt-3 sm:pt-4 space-y-2">
                  {edu.gpa && (
                    <p className="text-github-text text-sm sm:text-base">
                      <span className="text-neon-purple">GPA:</span> {edu.gpa}
                    </p>
                  )}
                  {edu.honors && (
                    <p className="text-github-text text-sm sm:text-base">
                      <span className="text-neon-purple">Honors:</span> {edu.honors}
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

export default EducationTab;
