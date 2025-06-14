/**
 * GitHub Contribution Heatmap Component
 * Uses Cal-Heatmap library to display GitHub-style contribution calendar
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { GitHubContributionHeatmapProps, GITHUB_COLORS } from '@/types/github';
import { transformContributionsForHeatmap, formatNumber, getContributionLevelColor } from '@/utils/githubCalculations';

// Dynamic import for Cal-Heatmap to avoid SSR issues
let CalHeatmap: any = null;
let Tooltip: any = null;

/**
 * GitHub Contribution Heatmap Component
 */
export function GitHubContributionHeatmap({
  contributions,
  isLoading,
  error,
  year = new Date().getFullYear(),
  className = '',
}: GitHubContributionHeatmapProps) {
  const calendarRef = useRef<HTMLDivElement>(null);
  const calInstanceRef = useRef<any>(null);
  const [isCalHeatmapLoaded, setIsCalHeatmapLoaded] = useState(false);
  const [calError, setCalError] = useState<string | null>(null);

  /**
   * Load Cal-Heatmap dynamically
   */
  useEffect(() => {
    const loadCalHeatmap = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const CalHeatmapModule = await import('cal-heatmap');
        const TooltipModule = await import('cal-heatmap/plugins/Tooltip');

        CalHeatmap = CalHeatmapModule.default || CalHeatmapModule;
        Tooltip = TooltipModule.default || TooltipModule;

        if (!CalHeatmap || !Tooltip) {
          throw new Error('Cal-Heatmap modules not loaded correctly');
        }

        setIsCalHeatmapLoaded(true);
      } catch (err) {
        console.error('Failed to load Cal-Heatmap:', err);
        setCalError('Failed to load calendar component. Using fallback display.');
      }
    };

    loadCalHeatmap();
  }, []);

  /**
   * Initialize Cal-Heatmap instance
   */
  useEffect(() => {
    if (!isCalHeatmapLoaded || !CalHeatmap || !calendarRef.current || !contributions) {
      return;
    }

    // Destroy existing instance
    if (calInstanceRef.current) {
      calInstanceRef.current.destroy();
    }

    try {
      // Transform contribution data for Cal-Heatmap
      const heatmapData = transformContributionsForHeatmap(
        contributions.weeks.flatMap(week => week.contributionDays)
      );

      // Create new Cal-Heatmap instance
      const cal = new CalHeatmap();
      
      cal.paint({
        // Container element
        itemSelector: calendarRef.current,
        
        // Data configuration
        data: {
          source: heatmapData,
          type: 'json',
        },
        
        // Date configuration
        date: {
          start: new Date(year, 0, 1),
          min: new Date(year, 0, 1),
          max: new Date(year, 11, 31),
        },
        
        // Range and scale
        range: 12, // 12 months
        scale: {
          color: {
            type: 'threshold',
            range: [
              GITHUB_COLORS.level0,
              GITHUB_COLORS.level1,
              GITHUB_COLORS.level2,
              GITHUB_COLORS.level3,
              GITHUB_COLORS.level4,
            ],
            domain: [1, 3, 6, 10],
          },
        },
        
        // Domain configuration
        domain: {
          type: 'month',
          gutter: 4,
          label: {
            text: 'MMM',
            textAlign: 'start',
            position: 'top',
          },
        },
        
        // Subdomain configuration (days)
        subDomain: {
          type: 'ghDay',
          radius: 2,
          width: 11,
          height: 11,
          gutter: 2,
        },
        
        // Theme
        theme: 'dark',
        
        // Animation
        animationDuration: 300,
      }, [
        // Plugins
        [
          Tooltip,
          {
            text: function (date: Date | number, value: number) {
              // Convert timestamp to Date object if needed
              const dateObj = typeof date === 'number' ? new Date(date * 1000) : date;
              const dateStr = dateObj.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });

              const contributionText = value === 1 ? 'contribution' : 'contributions';
              return `<div class="text-sm">
                <div class="font-medium">${value} ${contributionText}</div>
                <div class="text-gray-300">${dateStr}</div>
              </div>`;
            },
          },
        ],
      ]);

      calInstanceRef.current = cal;
    } catch (err) {
      console.error('Error initializing Cal-Heatmap:', err);
      setCalError('Failed to initialize contribution calendar');
    }

    // Cleanup function
    return () => {
      if (calInstanceRef.current) {
        calInstanceRef.current.destroy();
        calInstanceRef.current = null;
      }
    };
  }, [isCalHeatmapLoaded, contributions, year]);

  if (calError) {
    return (
      <div className={`bg-github-dark p-6 rounded-xl border border-github-border ${className}`}>
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="text-neon-green" size={24} />
          <div>
            <h3 className="text-xl font-bold text-white">Contribution Activity</h3>
            <p className="text-github-text text-sm">
              {contributions ? `${formatNumber(contributions.totalContributions)} contributions in ${year}` : 'Loading...'}
            </p>
          </div>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="text-yellow-400" size={20} />
            <h4 className="font-semibold text-yellow-300">Calendar Display Issue</h4>
          </div>
          <p className="text-yellow-400 text-sm">{calError}</p>
        </div>

        {/* Fallback simple grid display */}
        {contributions && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {formatNumber(contributions.totalContributions)}
              </div>
              <div className="text-github-text">Total Contributions in {year}</div>
            </div>

            <div className="grid grid-cols-7 gap-1 max-w-md mx-auto">
              {contributions.weeks.slice(0, 10).map((week, weekIndex) =>
                week.contributionDays.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded-sm ${getContributionLevelColor(day.level)}`}
                    title={`${day.count} contributions on ${day.date}`}
                  />
                ))
              )}
            </div>

            <div className="text-center text-sm text-github-text">
              Showing recent contribution activity (simplified view)
            </div>
          </div>
        )}
      </div>
    );
  }

  if (error && !contributions) {
    return (
      <div className={`bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-2">
          <AlertCircle className="text-yellow-500" size={20} />
          <h4 className="font-semibold text-yellow-700 dark:text-yellow-300">Contribution Data Unavailable</h4>
        </div>
        <p className="text-yellow-600 dark:text-yellow-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-github-dark p-6 rounded-xl border border-github-border ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="text-neon-green" size={24} />
          <div>
            <h3 className="text-xl font-bold text-white">Contribution Activity</h3>
            <p className="text-github-text text-sm">
              {contributions ? `${formatNumber(contributions.totalContributions)} contributions in ${year}` : 'Loading...'}
            </p>
          </div>
        </div>
        
        {error && (
          <div className="flex items-center gap-2 text-yellow-400 text-sm">
            <AlertCircle size={16} />
            <span>Simulated data</span>
          </div>
        )}
      </div>

      {/* Loading state */}
      {(isLoading || !isCalHeatmapLoaded) && (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3 text-github-text">
            <RefreshCw size={20} className="animate-spin" />
            <span>Loading contribution calendar...</span>
          </div>
        </div>
      )}

      {/* Cal-Heatmap container */}
      {!isLoading && isCalHeatmapLoaded && (
        <div className="contribution-calendar">
          <div ref={calendarRef} className="w-full overflow-x-auto" />
          
          {/* Legend */}
          <div className="flex items-center justify-between mt-4 text-sm text-github-text">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: GITHUB_COLORS.level0 }} />
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: GITHUB_COLORS.level1 }} />
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: GITHUB_COLORS.level2 }} />
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: GITHUB_COLORS.level3 }} />
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: GITHUB_COLORS.level4 }} />
            </div>
            <span>More</span>
          </div>
        </div>
      )}

      {/* Statistics summary */}
      {contributions && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {formatNumber(contributions.totalContributions)}
            </div>
            <div className="text-sm text-github-text">Total contributions</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {contributions.weeks.length}
            </div>
            <div className="text-sm text-github-text">Weeks tracked</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {Math.round(contributions.totalContributions / Math.max(contributions.weeks.length, 1))}
            </div>
            <div className="text-sm text-github-text">Avg per week</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {year}
            </div>
            <div className="text-sm text-github-text">Year</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
