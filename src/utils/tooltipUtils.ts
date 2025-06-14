/**
 * Utility functions for tooltip positioning and formatting
 */

import { D3ContributionData, TooltipPositionOptions, CalculatedTooltipPosition } from '@/types/d3-heatmap';

/**
 * Formats contribution data for tooltip display
 * @param contribution - The contribution data to format
 * @returns Formatted HTML string for tooltip content
 */
export function formatTooltipContent(contribution: D3ContributionData): string {
  const contributionText = contribution.value === 1 ? 'contribution' : 'contributions';
  const dateStr = contribution.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
    <div style="color: #10b981; font-weight: 500; font-size: 12px; line-height: 1.4;">
      ${contribution.value} ${contributionText}
    </div>
    <div style="color: #9ca3af; margin-top: 4px; font-size: 11px; line-height: 1.3;">
      ${dateStr}
    </div>
  `;
}

/**
 * Calculates optimal tooltip position relative to target element
 * @param options - Positioning options and constraints
 * @returns Calculated position coordinates and metadata
 */
export function calculateTooltipPosition(options: TooltipPositionOptions): CalculatedTooltipPosition {
  const { target, tooltip, preferredPosition, offset, viewportPadding } = options;
  
  const targetRect = target.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  let x = 0;
  let y = 0;
  let finalPosition = preferredPosition;
  let adjusted = false;

  // Calculate initial position based on preference
  switch (preferredPosition) {
    case 'top':
      x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
      y = targetRect.top - tooltipRect.height - offset;
      break;
    case 'bottom':
      x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
      y = targetRect.bottom + offset;
      break;
    case 'left':
      x = targetRect.left - tooltipRect.width - offset;
      y = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
      break;
    case 'right':
      x = targetRect.right + offset;
      y = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
      break;
  }

  // Check if tooltip would go outside viewport and adjust
  if (x < viewportPadding) {
    x = viewportPadding;
    adjusted = true;
  } else if (x + tooltipRect.width > viewport.width - viewportPadding) {
    x = viewport.width - tooltipRect.width - viewportPadding;
    adjusted = true;
  }

  if (y < viewportPadding) {
    // If top position doesn't fit, try bottom
    if (preferredPosition === 'top') {
      y = targetRect.bottom + offset;
      finalPosition = 'bottom';
      adjusted = true;
    } else {
      y = viewportPadding;
      adjusted = true;
    }
  } else if (y + tooltipRect.height > viewport.height - viewportPadding) {
    // If bottom position doesn't fit, try top
    if (preferredPosition === 'bottom') {
      y = targetRect.top - tooltipRect.height - offset;
      finalPosition = 'top';
      adjusted = true;
    } else {
      y = viewport.height - tooltipRect.height - viewportPadding;
      adjusted = true;
    }
  }

  return {
    x: Math.round(x),
    y: Math.round(y),
    position: finalPosition,
    adjusted,
  };
}

/**
 * Shows tooltip with smooth animation
 * @param tooltip - Tooltip element
 * @param content - HTML content to display
 * @param position - Position coordinates
 */
export function showTooltip(
  tooltip: HTMLElement,
  content: string,
  position: { x: number; y: number }
): void {
  tooltip.innerHTML = content;
  tooltip.style.left = `${position.x}px`;
  tooltip.style.top = `${position.y}px`;
  tooltip.style.visibility = 'visible';
  tooltip.style.opacity = '1';
  tooltip.style.transform = 'translateY(0) scale(1)';
}

/**
 * Hides tooltip with smooth animation
 * @param tooltip - Tooltip element
 */
export function hideTooltip(tooltip: HTMLElement): void {
  tooltip.style.visibility = 'hidden';
  tooltip.style.opacity = '0';
  tooltip.style.transform = 'translateY(-4px) scale(0.95)';
}

/**
 * Updates tooltip position smoothly during mouse movement
 * @param tooltip - Tooltip element
 * @param event - Mouse event
 * @param target - Target element
 * @param offset - Offset from cursor
 */
export function updateTooltipPosition(
  tooltip: HTMLElement,
  event: MouseEvent,
  target: Element,
  offset: number = 10
): void {
  const position = calculateTooltipPosition({
    event,
    target,
    tooltip,
    preferredPosition: 'top',
    offset,
    viewportPadding: 8,
  });

  tooltip.style.left = `${position.x}px`;
  tooltip.style.top = `${position.y}px`;
}

/**
 * Debounced tooltip position update for performance
 * @param tooltip - Tooltip element
 * @param event - Mouse event
 * @param target - Target element
 * @param delay - Debounce delay in milliseconds
 */
export function debouncedTooltipUpdate(
  tooltip: HTMLElement,
  event: MouseEvent,
  target: Element,
  delay: number = 16
): void {
  // Use requestAnimationFrame for smooth updates
  requestAnimationFrame(() => {
    updateTooltipPosition(tooltip, event, target);
  });
}

/**
 * Gets the SVG coordinates from a mouse event
 * @param event - Mouse event
 * @param svgElement - SVG element
 * @returns SVG coordinates
 */
export function getSVGCoordinates(event: MouseEvent, svgElement: SVGSVGElement): { x: number; y: number } {
  const rect = svgElement.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

/**
 * Checks if a point is within an element's bounds
 * @param point - Point coordinates
 * @param element - Element to check
 * @returns Whether point is within bounds
 */
export function isPointInElement(point: { x: number; y: number }, element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return (
    point.x >= rect.left &&
    point.x <= rect.right &&
    point.y >= rect.top &&
    point.y <= rect.bottom
  );
}
