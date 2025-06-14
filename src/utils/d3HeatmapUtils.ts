/**
 * Utility functions for D3.js heatmap creation and data transformation
 */

import * as d3 from 'd3';
import { GitHubContributionCalendar } from '@/types/github';
import { D3ContributionData, D3WeekData, HeatmapDimensions, D3HeatmapConfig } from '@/types/d3-heatmap';
import { transformContributionsForHeatmap } from './githubCalculations';

/**
 * Transforms GitHub contribution data to D3.js format
 * @param contributions - GitHub contribution calendar data
 * @returns Array of D3 contribution data points
 */
export function transformToD3Data(contributions: GitHubContributionCalendar): D3ContributionData[] {
  const contributionDays = contributions.weeks.flatMap(week => week.contributionDays);
  const heatmapData = transformContributionsForHeatmap(contributionDays);

  return Object.entries(heatmapData).map(([timestamp, value]) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return {
      date,
      value,
      timestamp: parseInt(timestamp),
      level: getContributionLevel(value),
    };
  }).sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Gets contribution level (0-4) based on count
 * @param count - Number of contributions
 * @returns Contribution level for color coding
 */
export function getContributionLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 10) return 3;
  return 4;
}

/**
 * Groups contribution data by weeks for D3.js visualization
 * @param data - Array of contribution data points
 * @returns Array of week data groups
 */
export function groupDataByWeeks(data: D3ContributionData[]): D3WeekData[] {
  const weeks = d3.groups(data, d => d3.timeWeek(d.date));
  
  return weeks.map(([weekStart, days]) => ({
    weekStart,
    days: days.sort((a, b) => a.date.getTime() - b.date.getTime()),
  }));
}

/**
 * Calculates heatmap dimensions based on configuration
 * @param config - Heatmap configuration
 * @returns Calculated dimensions
 */
export function calculateHeatmapDimensions(config: D3HeatmapConfig): HeatmapDimensions {
  const cellSize = 11;
  const cellPadding = 2;
  const weekWidth = cellSize + cellPadding;
  const dayHeight = cellSize + cellPadding;
  
  const margin = {
    top: config.showMonthLabels ? 30 : 10,
    right: 20,
    bottom: 30,
    left: config.showDayLabels ? 50 : 10,
  };

  const svgWidth = 53 * weekWidth + margin.left + margin.right;
  const svgHeight = 7 * dayHeight + margin.top + margin.bottom;

  return {
    cellSize,
    cellPadding,
    weekWidth,
    dayHeight,
    margin,
    svgWidth,
    svgHeight,
  };
}

/**
 * Creates D3.js color scale for GitHub-style contributions
 * @param config - Heatmap configuration
 * @returns D3 color scale function
 */
export function createColorScale(config: D3HeatmapConfig): d3.ScaleThreshold<number, string> {
  return d3.scaleThreshold<number, string>()
    .domain(config.colorDomain)
    .range(config.colorRange);
}

/**
 * Clears all SVG content safely
 * @param svgElement - SVG element to clear
 */
export function clearSVG(svgElement: SVGSVGElement): void {
  d3.select(svgElement).selectAll('*').remove();
}

/**
 * Creates month labels for the heatmap
 * @param svg - D3 selection of SVG element
 * @param dimensions - Heatmap dimensions
 * @param year - Target year
 */
export function createMonthLabels(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  dimensions: HeatmapDimensions,
  year: number
): void {
  const months = d3.timeMonths(new Date(year, 0, 1), new Date(year, 11, 31));
  
  svg.selectAll('.month-label')
    .data(months)
    .enter().append('text')
    .attr('class', 'month-label')
    .attr('x', (_, i) => dimensions.margin.left + i * (53 / 12) * dimensions.weekWidth)
    .attr('y', dimensions.margin.top - 10)
    .attr('fill', '#7d8590')
    .attr('font-size', '12px')
    .attr('font-family', 'system-ui, -apple-system, sans-serif')
    .text(d => d3.timeFormat('%b')(d));
}

/**
 * Creates day labels for the heatmap
 * @param svg - D3 selection of SVG element
 * @param dimensions - Heatmap dimensions
 */
export function createDayLabels(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  dimensions: HeatmapDimensions
): void {
  const dayLabels = ['Mon', 'Wed', 'Fri']; // Show only alternate days
  const dayIndices = [1, 3, 5]; // Monday, Wednesday, Friday
  
  svg.selectAll('.day-label')
    .data(dayLabels)
    .enter().append('text')
    .attr('class', 'day-label')
    .attr('x', dimensions.margin.left - 10)
    .attr('y', (_, i) => dimensions.margin.top + dayIndices[i] * dimensions.dayHeight + dimensions.cellSize / 2 + 4)
    .attr('fill', '#7d8590')
    .attr('font-size', '10px')
    .attr('font-family', 'system-ui, -apple-system, sans-serif')
    .attr('text-anchor', 'end')
    .text(d => d);
}

/**
 * Validates contribution data for D3.js rendering
 * @param data - Contribution data to validate
 * @returns Validation result with any errors
 */
export function validateContributionData(data: D3ContributionData[]): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Array.isArray(data)) {
    errors.push('Data must be an array');
    return { isValid: false, errors, warnings };
  }

  if (data.length === 0) {
    warnings.push('No contribution data provided');
  }

  data.forEach((item, index) => {
    if (!item.date || isNaN(item.date.getTime())) {
      errors.push(`Invalid date at index ${index}`);
    }
    
    if (typeof item.value !== 'number' || item.value < 0) {
      errors.push(`Invalid value at index ${index}: must be a non-negative number`);
    }
    
    if (typeof item.timestamp !== 'number') {
      errors.push(`Invalid timestamp at index ${index}`);
    }
    
    if (typeof item.level !== 'number' || item.level < 0 || item.level > 4) {
      errors.push(`Invalid level at index ${index}: must be 0-4`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Gets default D3 heatmap configuration
 * @param year - Target year
 * @returns Default configuration object
 */
export function getDefaultHeatmapConfig(year: number): D3HeatmapConfig {
  return {
    year,
    colorDomain: [1, 3, 6, 10],
    colorRange: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
    animationDuration: 300,
    showMonthLabels: true,
    showDayLabels: true,
  };
}

/**
 * Calculates statistics for contribution data
 * @param data - Contribution data
 * @returns Statistics object
 */
export function calculateContributionStats(data: D3ContributionData[]): {
  total: number;
  average: number;
  max: number;
  activeDays: number;
} {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const activeDays = data.filter(d => d.value > 0).length;
  const average = data.length > 0 ? total / data.length : 0;
  const max = data.length > 0 ? Math.max(...data.map(d => d.value)) : 0;

  return {
    total,
    average: Math.round(average * 100) / 100,
    max,
    activeDays,
  };
}
