/**
 * Custom hook for D3.js GitHub contribution heatmap
 * Handles SVG rendering, interactions, and tooltip management
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import * as d3 from 'd3';
import { GitHubContributionCalendar } from '@/types/github';
import { 
  UseD3HeatmapReturn, 
  D3ContributionData, 
  HeatmapDimensions, 
  D3HeatmapConfig,
  TooltipData,
  HeatmapRenderState 
} from '@/types/d3-heatmap';
import {
  transformToD3Data,
  groupDataByWeeks,
  calculateHeatmapDimensions,
  createColorScale,
  clearSVG,
  createMonthLabels,
  createDayLabels,
  validateContributionData,
  getDefaultHeatmapConfig
} from '@/utils/d3HeatmapUtils';
import {
  formatTooltipContent,
  calculateTooltipPosition,
  showTooltip,
  hideTooltip
} from '@/utils/tooltipUtils';

/**
 * Custom hook for managing D3.js heatmap rendering and interactions
 * @param contributions - GitHub contribution data
 * @param config - Heatmap configuration options
 * @returns Hook interface with refs, state, and control functions
 */
export function useD3Heatmap(
  contributions: GitHubContributionCalendar | null,
  config?: Partial<D3HeatmapConfig>
): UseD3HeatmapReturn {
  // Refs for DOM elements
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // State management
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const [renderState, setRenderState] = useState<HeatmapRenderState>({
    isRendering: false,
    lastRender: null,
    error: null,
    dataPointsRendered: 0,
  });
  const [dimensions, setDimensions] = useState<HeatmapDimensions | null>(null);

  /**
   * Creates the D3.js heatmap visualization
   * @param data - Transformed contribution data
   * @param heatmapConfig - Configuration for the heatmap
   */
  const createHeatmap = useCallback((data: D3ContributionData[], heatmapConfig: D3HeatmapConfig) => {
    if (!svgRef.current || !tooltipRef.current) return;

    setRenderState(prev => ({ ...prev, isRendering: true, error: null }));

    try {
      // Validate data
      const validation = validateContributionData(data);
      if (!validation.isValid) {
        throw new Error(`Data validation failed: ${validation.errors.join(', ')}`);
      }

      // Clear existing content
      clearSVG(svgRef.current);

      // Calculate dimensions
      const dims = calculateHeatmapDimensions(heatmapConfig);
      setDimensions(dims);

      // Set up SVG
      const svg = d3.select(svgRef.current)
        .attr('width', dims.svgWidth)
        .attr('height', dims.svgHeight);

      // Create color scale
      const colorScale = createColorScale(heatmapConfig);

      // Group data by weeks
      const weekData = groupDataByWeeks(data);

      // Create main group
      const g = svg.append('g')
        .attr('transform', `translate(${dims.margin.left}, ${dims.margin.top})`);

      // Create month labels
      if (heatmapConfig.showMonthLabels) {
        createMonthLabels(svg, dims, heatmapConfig.year);
      }

      // Create day labels
      if (heatmapConfig.showDayLabels) {
        createDayLabels(svg, dims);
      }

      // Create week groups
      const weekGroups = g.selectAll('.week')
        .data(weekData)
        .enter().append('g')
        .attr('class', 'week')
        .attr('transform', (_, i) => `translate(${i * dims.weekWidth}, 0)`);

      // Create day rectangles
      const dayRects = weekGroups.selectAll('.day')
        .data(d => d.days)
        .enter().append('rect')
        .attr('class', 'day')
        .attr('x', 0)
        .attr('y', d => d.date.getDay() * dims.dayHeight)
        .attr('width', dims.cellSize)
        .attr('height', dims.cellSize)
        .attr('rx', 2)
        .attr('fill', d => colorScale(d.value))
        .attr('stroke', '#21262d')
        .attr('stroke-width', 1)
        .style('cursor', 'pointer')
        .on('mouseover', handleMouseOver)
        .on('mousemove', handleMouseMove)
        .on('mouseout', handleMouseOut);

      // Add smooth transitions
      dayRects
        .style('opacity', 0)
        .transition()
        .duration(heatmapConfig.animationDuration)
        .delay((_, i) => i * 2)
        .style('opacity', 1);

      setRenderState(prev => ({
        ...prev,
        isRendering: false,
        lastRender: Date.now(),
        dataPointsRendered: data.length,
      }));

    } catch (error) {
      console.error('Error creating D3 heatmap:', error);
      setRenderState(prev => ({
        ...prev,
        isRendering: false,
        error: error instanceof Error ? error.message : 'Unknown rendering error',
      }));
    }
  }, []);

  /**
   * Handles mouse over events on contribution cells
   */
  const handleMouseOver = useCallback((event: MouseEvent, d: D3ContributionData) => {
    if (!tooltipRef.current) return;

    const content = formatTooltipContent(d);
    const target = event.target as Element;

    // Calculate position
    const position = calculateTooltipPosition({
      event,
      target,
      tooltip: tooltipRef.current,
      preferredPosition: 'top',
      offset: 8,
      viewportPadding: 8,
    });

    // Show tooltip
    showTooltip(tooltipRef.current, content, position);

    // Update state
    setTooltipData({
      contribution: d,
      content,
      position,
      visible: true,
    });
  }, []);

  /**
   * Handles mouse move events for smooth tooltip following
   */
  const handleMouseMove = useCallback((event: MouseEvent, d: D3ContributionData) => {
    if (!tooltipRef.current || !tooltipData?.visible) return;

    const target = event.target as Element;
    const position = calculateTooltipPosition({
      event,
      target,
      tooltip: tooltipRef.current,
      preferredPosition: 'top',
      offset: 8,
      viewportPadding: 8,
    });

    tooltipRef.current.style.left = `${position.x}px`;
    tooltipRef.current.style.top = `${position.y}px`;
  }, [tooltipData]);

  /**
   * Handles mouse out events to hide tooltip
   */
  const handleMouseOut = useCallback(() => {
    if (!tooltipRef.current) return;

    hideTooltip(tooltipRef.current);
    setTooltipData(null);
  }, []);

  /**
   * Manually triggers a re-render of the heatmap
   */
  const rerender = useCallback(() => {
    if (!contributions) return;

    const data = transformToD3Data(contributions);
    const heatmapConfig = {
      ...getDefaultHeatmapConfig(new Date().getFullYear()),
      ...config,
    };

    createHeatmap(data, heatmapConfig);
  }, [contributions, config, createHeatmap]);

  /**
   * Effect to render heatmap when data or config changes
   */
  useEffect(() => {
    if (!contributions) return;

    const data = transformToD3Data(contributions);
    const heatmapConfig = {
      ...getDefaultHeatmapConfig(config?.year || new Date().getFullYear()),
      ...config,
    };

    createHeatmap(data, heatmapConfig);
  }, [contributions, config, createHeatmap]);

  return {
    svgRef,
    tooltipRef,
    tooltipData,
    isRendering: renderState.isRendering,
    renderError: renderState.error,
    rerender,
    dimensions,
  };
}
