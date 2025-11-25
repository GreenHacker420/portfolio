'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Briefcase, GraduationCap, Award, Trophy } from 'lucide-react';
import { TabNavigation } from '@/components/ui/tab-navigation';
import { WorkExperienceTab } from './WorkExperienceTab';
import { EducationTab } from './EducationTab';
import { CertificationsTab } from './CertificationsTab';
import { AchievementsTab } from './AchievementsTab';
import { LoadingState } from './LoadingState';
import type {
  ExperienceItem,
  EducationItem,
  CertificationItem,
  AchievementItem,
  ExperienceTabId,
} from '@/types/experience.d';

const tabs = [
  { id: 'work' as const, label: 'Work Experience', shortLabel: 'Work', icon: Briefcase, color: 'neon-green' as const },
  { id: 'education' as const, label: 'Education', shortLabel: 'Edu', icon: GraduationCap, color: 'neon-purple' as const },
  { id: 'certifications' as const, label: 'Certifications', shortLabel: 'Certs', icon: Award, color: 'neon-blue' as const },
  { id: 'achievements' as const, label: 'Achievements', shortLabel: 'Awards', icon: Trophy, color: 'neon-green' as const },
];

export function Experience() {
  const [activeTab, setActiveTab] = useState<ExperienceTabId>('work');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [expRes, eduRes, certRes, achRes] = await Promise.all([
        fetch('/api/experience'),
        fetch('/api/education'),
        fetch('/api/certifications'),
        fetch('/api/achievements'),
      ]);

      if (expRes.ok) {
        const expData = await expRes.json();
        setExperiences(expData.experiences || []);
      }

      if (eduRes.ok) {
        const eduData = await eduRes.json();
        setEducation(eduData.education || []);
      }

      if (certRes.ok) {
        const certData = await certRes.json();
        setCertifications(certData.certifications || []);
      }

      if (achRes.ok) {
        const achData = await achRes.json();
        setAchievements(achData.achievements || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItem = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const currentTabIndex = tabs.findIndex((t) => t.id === activeTab);

  const handleSwipe = useCallback(
    (direction: 'left' | 'right') => {
      const newIndex =
        direction === 'left'
          ? Math.min(currentTabIndex + 1, tabs.length - 1)
          : Math.max(currentTabIndex - 1, 0);

      if (newIndex !== currentTabIndex) {
        setSwipeDirection(direction);
        setActiveTab(tabs[newIndex].id);
        setExpandedItem(null);
      }
    },
    [currentTabIndex]
  );

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const threshold = 50;
      if (info.offset.x > threshold) {
        handleSwipe('right');
      } else if (info.offset.x < -threshold) {
        handleSwipe('left');
      }
    },
    [handleSwipe]
  );

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as ExperienceTabId);
    setExpandedItem(null);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <section id="experience" className="py-16 sm:py-20 bg-github-dark">
      <div className="section-container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="section-title"
        >
          Experience
        </motion.h2>

        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Swipeable Content Area */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          className="touch-pan-y"
        >
          <AnimatePresence mode="wait">
            {activeTab === 'work' && (
              <WorkExperienceTab
                key="work"
                experiences={experiences}
                expandedItem={expandedItem}
                onToggle={toggleItem}
                swipeDirection={swipeDirection}
              />
            )}

            {activeTab === 'education' && (
              <EducationTab
                key="education"
                education={education}
                expandedItem={expandedItem}
                onToggle={toggleItem}
                swipeDirection={swipeDirection}
              />
            )}

            {activeTab === 'certifications' && (
              <CertificationsTab
                key="certifications"
                certifications={certifications}
                swipeDirection={swipeDirection}
              />
            )}

            {activeTab === 'achievements' && (
              <AchievementsTab
                key="achievements"
                achievements={achievements}
                swipeDirection={swipeDirection}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

export default Experience;
