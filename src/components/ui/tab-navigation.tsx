'use client';

import { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  color: 'neon-green' | 'neon-purple' | 'neon-blue' | 'neon-pink';
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

const colorMap = {
  'neon-green': {
    bg: '#3fb950',
    shadow: 'rgba(63, 185, 80, 0.5)',
  },
  'neon-purple': {
    bg: '#bf4dff',
    shadow: 'rgba(191, 77, 255, 0.5)',
  },
  'neon-blue': {
    bg: '#1f6feb',
    shadow: 'rgba(31, 111, 235, 0.5)',
  },
  'neon-pink': {
    bg: '#f778ba',
    shadow: 'rgba(247, 120, 186, 0.5)',
  },
};

export function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  className,
}: TabNavigationProps) {
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const currentIndex = tabs.findIndex((t) => t.id === activeTab);

  const navigateTab = (direction: 'prev' | 'next') => {
    const newIndex =
      direction === 'next'
        ? Math.min(currentIndex + 1, tabs.length - 1)
        : Math.max(currentIndex - 1, 0);

    if (newIndex !== currentIndex) {
      onTabChange(tabs[newIndex].id);
    }
  };

  // Scroll active tab into view on mobile
  useEffect(() => {
    if (tabsContainerRef.current) {
      const activeButton = tabsContainerRef.current.querySelector(
        `[data-tab="${activeTab}"]`
      );
      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [activeTab]);

  return (
    <div className={cn('w-full', className)}>
      {/* Mobile Tab Navigation with Arrows */}
      <div className="flex items-center justify-center gap-2 mb-8 md:hidden">
        <button
          onClick={() => navigateTab('prev')}
          disabled={currentIndex === 0}
          className="p-2 rounded-full bg-github-light border border-github-border disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-github-dark"
          aria-label="Previous tab"
        >
          <ChevronLeft className="w-5 h-5 text-github-text" />
        </button>

        <div
          ref={tabsContainerRef}
          className="flex gap-1 overflow-x-auto hide-scrollbar snap-x snap-mandatory px-2 max-w-[70vw]"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const colors = colorMap[tab.color];

            return (
              <button
                key={tab.id}
                data-tab={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap snap-center transition-all duration-200 min-w-fit',
                  isActive
                    ? 'text-black'
                    : 'text-github-text hover:text-white bg-github-light/50'
                )}
                style={
                  isActive
                    ? {
                        backgroundColor: colors.bg,
                        boxShadow: `0 0 10px ${colors.shadow}`,
                      }
                    : {}
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => navigateTab('next')}
          disabled={currentIndex === tabs.length - 1}
          className="p-2 rounded-full bg-github-light border border-github-border disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-github-dark"
          aria-label="Next tab"
        >
          <ChevronRight className="w-5 h-5 text-github-text" />
        </button>
      </div>

      {/* Desktop Tab Navigation */}
      <div className="hidden md:flex justify-center mb-12">
        <div className="inline-flex rounded-lg shadow-sm p-1.5 bg-github-light border border-github-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const colors = colorMap[tab.color];

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200',
                  isActive
                    ? 'text-black'
                    : 'text-github-text hover:text-white hover:bg-github-dark/50'
                )}
                style={
                  isActive
                    ? {
                        backgroundColor: colors.bg,
                        boxShadow: `0 0 15px ${colors.shadow}`,
                      }
                    : {}
                }
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Swipe indicator for mobile */}
      <div className="flex justify-center gap-1.5 mb-6 md:hidden">
        {tabs.map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-1 rounded-full transition-all duration-300',
              index === currentIndex ? 'w-6 bg-neon-green' : 'w-1.5 bg-github-border'
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default TabNavigation;
