/**
 * TypeScript types for D3.js GitHub contribution heatmap
 */

import { GitHubContributionCalendar } from './github';

/**
 * Individual contribution data point for D3.js visualization
 */
export interface D3ContributionData {
  /** Date of the contribution */
  date: Date;
  /** Number of contributions on this date */
  value: number;
  /** Unix timestamp in seconds */
  timestamp: number;
  /** Contribution level (0-4) for color coding */
  level: number;
}

/**
 * Week group data structure for D3.js
 */
export interface D3WeekData {
  /** Week start date */
  weekStart: Date;
  /** Array of contribution days in this week */
  days: D3ContributionData[];
}

/**
 * Heatmap dimensions and layout configuration
 */
export interface HeatmapDimensions {
  /** Size of each contribution cell */
  cellSize: number;
  /** Padding between cells */
  cellPadding: number;
  /** Width of each week column */
  weekWidth: number;
  /** Height of each day row */
  dayHeight: number;
  /** Margins around the heatmap */
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  /** Total SVG width */
  svgWidth: number;
  /** Total SVG height */
  svgHeight: number;
}

/**
 * Tooltip data and positioning
 */
export interface TooltipData {
  /** Contribution data for the hovered cell */
  contribution: D3ContributionData;
  /** Formatted tooltip content */
  content: string;
  /** Tooltip position */
  position: {
    x: number;
    y: number;
  };
  /** Whether tooltip is visible */
  visible: boolean;
}

/**
 * D3 heatmap configuration options
 */
export interface D3HeatmapConfig {
  /** Target year for the heatmap */
  year: number;
  /** Color scale domain values */
  colorDomain: number[];
  /** Color scale range (GitHub colors) */
  colorRange: string[];
  /** Animation duration in milliseconds */
  animationDuration: number;
  /** Whether to show month labels */
  showMonthLabels: boolean;
  /** Whether to show day labels */
  showDayLabels: boolean;
}

/**
 * D3 heatmap hook return type
 */
export interface UseD3HeatmapReturn {
  /** SVG ref for D3.js to attach to */
  svgRef: React.RefObject<SVGSVGElement>;
  /** Tooltip ref for positioning */
  tooltipRef: React.RefObject<HTMLDivElement>;
  /** Current tooltip data */
  tooltipData: TooltipData | null;
  /** Whether the heatmap is rendering */
  isRendering: boolean;
  /** Any rendering errors */
  renderError: string | null;
  /** Function to manually trigger re-render */
  rerender: () => void;
  /** Heatmap dimensions */
  dimensions: HeatmapDimensions | null;
}

/**
 * Tooltip positioning options
 */
export interface TooltipPositionOptions {
  /** Mouse event for positioning */
  event: MouseEvent;
  /** Target element that was hovered */
  target: Element;
  /** Tooltip element */
  tooltip: HTMLElement;
  /** Preferred position relative to target */
  preferredPosition: 'top' | 'bottom' | 'left' | 'right';
  /** Offset from target element */
  offset: number;
  /** Viewport padding to avoid edges */
  viewportPadding: number;
}

/**
 * Calculated tooltip position
 */
export interface CalculatedTooltipPosition {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
  /** Final position used (may differ from preferred) */
  position: 'top' | 'bottom' | 'left' | 'right';
  /** Whether position was adjusted for viewport */
  adjusted: boolean;
}

/**
 * Heatmap render state
 */
export interface HeatmapRenderState {
  /** Whether currently rendering */
  isRendering: boolean;
  /** Last render timestamp */
  lastRender: number | null;
  /** Render error if any */
  error: string | null;
  /** Number of data points rendered */
  dataPointsRendered: number;
}

/**
 * Year selector state
 */
export interface YearSelectorState {
  /** Currently selected year */
  selectedYear: number;
  /** Available years for selection */
  availableYears: number[];
  /** Whether dropdown is open */
  isDropdownOpen: boolean;
  /** Whether year is currently changing */
  isChanging: boolean;
}
