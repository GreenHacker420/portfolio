/**
 * GitHub Contribution Heatmap Component
 * Refactored with proper separation of concerns and improved maintainability
 * Uses custom hooks and utility functions for better code organization
 */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { animateIn } from '@/utils/animation-anime';
import { Calendar, AlertCircle, RefreshCw } from 'lucide-react';
import { GitHubContributionHeatmapProps, GITHUB_COLORS } from '@/types/github';
import { formatNumber } from '@/utils/githubCalculations';
import { useGitHubContributions } from '@/hooks/useGitHubContributions';
import { useD3Heatmap } from '@/hooks/useD3Heatmap';
import { YearSelector } from './YearSelector';
import { HeatmapErrorBoundary, HeatmapFallback } from './HeatmapErrorBoundary';
import { getDefaultHeatmapConfig } from '@/utils/d3HeatmapUtils';

/**
 * Main GitHub Contribution Heatmap Component
 * Orchestrates data fetching, year selection, and heatmap rendering
 */
export function GitHubContributionHeatmap({
  contributions: propContributions,
  isLoading: propIsLoading,
  error: propError,
  year: propYear,
  className = '',
}: GitHubContributionHeatmapProps) {
  // Year management state
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(propYear || currentYear);

  // Available years (current year and 4 years back)
  const availableYears = useMemo(
    () => Array.from({ length: 5 }, (_, i) => currentYear - i),
    [currentYear]
  );

  // Fetch data for the selected year using the hook
  const {
    contributions: hookContributions,
    isLoading: hookIsLoading,
    error: hookError
  } = useGitHubContributions(selectedYear);

  // Use prop data if provided, otherwise use hook data
  const contributions = propContributions || hookContributions;
  const isLoading = propIsLoading !== undefined ? propIsLoading : hookIsLoading;
  const error = propError || hookError;

  // D3 heatmap configuration
  const heatmapConfig = useMemo(() => ({
    ...getDefaultHeatmapConfig(selectedYear),
    year: selectedYear,
  }), [selectedYear]);

  // Initialize D3 heatmap with custom hook
  const {
    svgRef,
    tooltipRef,
    tooltipData,
    isRendering,
    renderError,
    rerender,
    dimensions,
  } = useD3Heatmap(contributions, heatmapConfig);



  /**
   * Handles year selection change
   * @param year - Selected year
   */
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  // Show fallback if there's a render error
  if (renderError) {
    return (
      <HeatmapFallback
        error={new Error(renderError)}
        resetError={rerender}
      />
    );
  }

  useEffect(() => { animateIn('#gh-heatmap .anim'); }, []);

  return (
    <HeatmapErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Heatmap Error Boundary:', error, errorInfo);
      }}
      showDetails={process.env.NODE_ENV === 'development'}
    >
      <div id="gh-heatmap" className={`bg-github-dark p-6 rounded-xl border border-github-border ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="text-neon-green" size={24} />
            <div>
              <h3 className="text-xl font-bold text-white">Contribution Activity</h3>
              <p className="text-github-text text-sm">
                {contributions
                  ? `${formatNumber(contributions.totalContributions)} contributions in ${selectedYear}`
                  : 'Loading...'
                }
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
        <YearSelector
          selectedYear={selectedYear}
          availableYears={availableYears}
          onYearChange={handleYearChange}
          isLoading={isLoading || isRendering}
          className="mb-6"
        />

        {/* Loading state */}
        {(isLoading || isRendering) && (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3 text-github-text">
              <RefreshCw size={20} className="animate-spin" />
              <span>
                {isLoading ? 'Loading contribution data...' : 'Rendering calendar...'}
              </span>
            </div>
          </div>
        )}

        {/* D3.js Heatmap container */}
        {!isLoading && !isRendering && contributions && (
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
            transform: 'translateY(-4px) scale(0.95)',
            maxWidth: '280px',
            fontSize: '12px',
            lineHeight: '1.4',
          }}
        />
      </div>
    </HeatmapErrorBoundary>
  );
}
