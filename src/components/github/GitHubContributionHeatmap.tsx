/**
 * GitHub Contribution Heatmap Component
 * Uses D3.js to display GitHub-style contribution calendar
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle, RefreshCw, ChevronDown } from 'lucide-react';
import * as d3 from 'd3';
import { GitHubContributionHeatmapProps, GITHUB_COLORS } from '@/types/github';
import { transformContributionsForHeatmap, formatNumber, getContributionLevelColor } from '@/utils/githubCalculations';
import { useGitHubContributions } from '@/hooks/useGitHubContributions';

/**
 * GitHub Contribution Heatmap Component with Year Selector
 */
export function GitHubContributionHeatmap({
  contributions: propContributions,
  isLoading: propIsLoading,
  error: propError,
  year: propYear,
  className = '',
}: GitHubContributionHeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [heatmapError, setHeatmapError] = useState<string | null>(null);

  // Year selector state
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(propYear || currentYear);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  // Available years (current year and 4 years back)
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Use the hook to fetch data for the selected year
  const {
    contributions: hookContributions,
    isLoading: hookIsLoading,
    error: hookError
  } = useGitHubContributions(selectedYear);

  // Use prop data if provided, otherwise use hook data
  const contributions = propContributions || hookContributions;
  const isLoading = propIsLoading !== undefined ? propIsLoading : hookIsLoading;
  const error = propError || hookError;



  /**
   * Create D3.js GitHub-style contribution calendar
   */
  const createD3Heatmap = (heatmapData: Record<number, number>) => {
    if (!svgRef.current) return;

    // Clear existing content
    d3.select(svgRef.current).selectAll('*').remove();

    // Convert heatmap data to array format
    const dataArray = Object.entries(heatmapData).map(([timestamp, value]) => ({
      date: new Date(parseInt(timestamp) * 1000),
      value: value,
      timestamp: parseInt(timestamp)
    })).sort((a, b) => a.date.getTime() - b.date.getTime());

    if (dataArray.length === 0) return;

    // Calendar dimensions
    const cellSize = 11;
    const cellPadding = 2;
    const weekWidth = cellSize + cellPadding;
    const dayHeight = cellSize + cellPadding;
    const margin = { top: 30, right: 20, bottom: 30, left: 50 };

    // SVG dimensions
    const svgWidth = 53 * weekWidth + margin.left + margin.right;
    const svgHeight = 7 * dayHeight + margin.top + margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    // Color scale (GitHub style)
    const colorScale = d3.scaleThreshold<number, string>()
      .domain([1, 3, 6, 10])
      .range([
        GITHUB_COLORS.level0,
        GITHUB_COLORS.level1,
        GITHUB_COLORS.level2,
        GITHUB_COLORS.level3,
        GITHUB_COLORS.level4,
      ]);

    // Group data by week
    const weeks = d3.groups(dataArray, d => d3.timeWeek(d.date));

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Draw calendar
    const weekGroups = g.selectAll('.week')
      .data(weeks)
      .enter().append('g')
      .attr('class', 'week')
      .attr('transform', (_, i) => `translate(${i * weekWidth}, 0)`);

    weekGroups.selectAll('.day')
      .data(d => d[1])
      .enter().append('rect')
      .attr('class', 'day')
      .attr('x', 0)
      .attr('y', d => d.date.getDay() * dayHeight)
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('rx', 2)
      .attr('fill', d => colorScale(d.value))
      .attr('stroke', '#21262d')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        if (!tooltipRef.current) return;

        const contributionText = d.value === 1 ? 'contribution' : 'contributions';
        const dateStr = d.date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        tooltipRef.current.innerHTML = `
          <div style="color: #10b981; font-weight: 500; font-size: 12px;">${d.value} ${contributionText}</div>
          <div style="color: #9ca3af; margin-top: 4px; font-size: 11px;">${dateStr}</div>
        `;

        // Show tooltip immediately
        tooltipRef.current.style.visibility = 'visible';
        tooltipRef.current.style.opacity = '1';
        tooltipRef.current.style.transform = 'translateY(0)';

        // Position tooltip after it's visible to get correct dimensions
        setTimeout(() => {
          if (!tooltipRef.current) return;

          const rect = (event.target as Element).getBoundingClientRect();
          const tooltipRect = tooltipRef.current.getBoundingClientRect();

          // Calculate position to keep tooltip in viewport
          let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
          let top = rect.top - tooltipRect.height - 8;

          // Adjust if tooltip would go off screen
          if (left < 8) left = 8;
          if (left + tooltipRect.width > window.innerWidth - 8) {
            left = window.innerWidth - tooltipRect.width - 8;
          }
          if (top < 8) {
            top = rect.bottom + 8;
          }

          tooltipRef.current.style.left = left + 'px';
          tooltipRef.current.style.top = top + 'px';
        }, 0);
      })
      .on('mouseout', function() {
        if (!tooltipRef.current) return;
        tooltipRef.current.style.visibility = 'hidden';
        tooltipRef.current.style.opacity = '0';
        tooltipRef.current.style.transform = 'translateY(-4px)';
      });

    // Add month labels
    const months = d3.timeMonths(new Date(selectedYear, 0, 1), new Date(selectedYear, 11, 31));
    g.selectAll('.month-label')
      .data(months)
      .enter().append('text')
      .attr('class', 'month-label')
      .attr('x', (_, i) => i * (53 / 12) * weekWidth)
      .attr('y', -10)
      .attr('fill', '#7d8590')
      .attr('font-size', '12px')
      .attr('font-family', 'system-ui, -apple-system, sans-serif')
      .text(d => d3.timeFormat('%b')(d));

    // Add day labels
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    g.selectAll('.day-label')
      .data(dayLabels.filter((_, i) => i % 2 === 1)) // Show only Mon, Wed, Fri
      .enter().append('text')
      .attr('class', 'day-label')
      .attr('x', -10)
      .attr('y', (_, i) => (i * 2 + 1) * dayHeight + cellSize/2 + 4)
      .attr('fill', '#7d8590')
      .attr('font-size', '10px')
      .attr('font-family', 'system-ui, -apple-system, sans-serif')
      .attr('text-anchor', 'end')
      .text(d => d);
  };

  /**
   * Initialize D3.js heatmap
   */
  useEffect(() => {
    if (!contributions || isLoading) {
      return;
    }

    try {
      // Transform contribution data for D3.js heatmap
      const contributionDays = contributions.weeks.flatMap(week => week.contributionDays);
      const heatmapData = transformContributionsForHeatmap(contributionDays);

      // Create D3.js heatmap
      createD3Heatmap(heatmapData);

      setHeatmapError(null);
    } catch (err) {
      console.error('Error creating D3 heatmap:', err);
      setHeatmapError('Failed to create contribution calendar');
    }
  }, [contributions, selectedYear, isLoading]);

  /**
   * Handle click outside dropdown to close it
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsYearDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsYearDropdownOpen(false);
      }
    };

    if (isYearDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isYearDropdownOpen]);

  if (heatmapError) {
    return (
      <div className={`bg-github-dark p-6 rounded-xl border border-github-border ${className}`}>
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="text-neon-green" size={24} />
          <div>
            <h3 className="text-xl font-bold text-white">Contribution Activity</h3>
            <p className="text-github-text text-sm">
              {contributions ? `${formatNumber(contributions.totalContributions)} contributions in ${selectedYear}` : 'Loading...'}
            </p>
          </div>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="text-yellow-400" size={20} />
            <h4 className="font-semibold text-yellow-300">Calendar Display Issue</h4>
          </div>
          <p className="text-yellow-400 text-sm">{heatmapError}</p>
        </div>

        {/* Fallback simple grid display */}
        {contributions && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {formatNumber(contributions.totalContributions)}
              </div>
              <div className="text-github-text">Total Contributions in {selectedYear}</div>
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
              {contributions ? `${formatNumber(contributions.totalContributions)} contributions in ${selectedYear}` : 'Loading...'}
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

      {/* Year Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-github-text">
          Select year to view contribution history
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-github-dark border border-github-border rounded-lg text-white hover:border-neon-green/50 transition-colors focus:outline-none focus:ring-2 focus:ring-neon-green/20"
            aria-label="Select year"
            aria-expanded={isYearDropdownOpen}
            aria-haspopup="listbox"
          >
            <span className="font-medium">{selectedYear}</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${isYearDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isYearDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 bg-github-dark border border-github-border rounded-lg shadow-xl z-50 min-w-[120px]"
              role="listbox"
              aria-label="Year options"
            >
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setIsYearDropdownOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedYear(year);
                      setIsYearDropdownOpen(false);
                    }
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-github-border transition-colors first:rounded-t-lg last:rounded-b-lg focus:outline-none focus:bg-github-border ${
                    year === selectedYear
                      ? 'bg-neon-green/10 text-neon-green'
                      : 'text-white hover:text-neon-green'
                  }`}
                  role="option"
                  aria-selected={year === selectedYear}
                  tabIndex={0}
                >
                  {year}
                  {year === currentYear && (
                    <span className="ml-2 text-xs text-github-text">(current)</span>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3 text-github-text">
            <RefreshCw size={20} className="animate-spin" />
            <span>Loading contribution calendar...</span>
          </div>
        </div>
      )}

      {/* D3.js Heatmap container */}
      {!isLoading && contributions && (
        <div className="contribution-calendar">
          <div className="w-full overflow-x-auto flex justify-center">
            <div className="inline-block">
              <svg ref={svgRef} className="block" />
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center mt-6 text-sm text-github-text">
            <div className="flex items-center gap-3">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm border border-github-border" style={{ backgroundColor: GITHUB_COLORS.level0 }} />
                <div className="w-3 h-3 rounded-sm border border-github-border" style={{ backgroundColor: GITHUB_COLORS.level1 }} />
                <div className="w-3 h-3 rounded-sm border border-github-border" style={{ backgroundColor: GITHUB_COLORS.level2 }} />
                <div className="w-3 h-3 rounded-sm border border-github-border" style={{ backgroundColor: GITHUB_COLORS.level3 }} />
                <div className="w-3 h-3 rounded-sm border border-github-border" style={{ backgroundColor: GITHUB_COLORS.level4 }} />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed pointer-events-none z-50 bg-gray-900 text-white rounded-lg px-3 py-2 shadow-xl border border-gray-700 transition-all duration-200"
        style={{
          visibility: 'hidden',
          opacity: 0,
          transform: 'translateY(-4px)',
          maxWidth: '280px',
          fontSize: '12px',
          lineHeight: '1.4',
        }}
      />

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
              {selectedYear}
            </div>
            <div className="text-sm text-github-text">Year</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
