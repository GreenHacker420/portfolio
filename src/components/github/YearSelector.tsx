/**
 * Year Selector Component for GitHub Contribution Heatmap
 * Provides dropdown interface for selecting different years
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { YearSelectorState } from '@/types/d3-heatmap';

/**
 * Props for YearSelector component
 */
interface YearSelectorProps {
  /** Currently selected year */
  selectedYear: number;
  /** Available years for selection */
  availableYears: number[];
  /** Callback when year is selected */
  onYearChange: (year: number) => void;
  /** Whether year change is in progress */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether the selector is disabled */
  disabled?: boolean;
}

/**
 * Year Selector Component
 * Provides accessible dropdown for year selection with keyboard navigation
 */
export function YearSelector({
  selectedYear,
  availableYears,
  onYearChange,
  isLoading = false,
  className = '',
  disabled = false,
}: YearSelectorProps) {
  // Component state
  const [state, setState] = useState<YearSelectorState>({
    selectedYear,
    availableYears,
    isDropdownOpen: false,
    isChanging: false,
  });

  // Refs for DOM elements
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Current year for marking
  const currentYear = new Date().getFullYear();

  /**
   * Handles year selection
   * @param year - Selected year
   */
  const handleYearSelect = (year: number) => {
    if (year === selectedYear || disabled || isLoading) return;

    setState(prev => ({
      ...prev,
      selectedYear: year,
      isDropdownOpen: false,
      isChanging: true,
    }));

    onYearChange(year);

    // Reset changing state after a delay
    setTimeout(() => {
      setState(prev => ({ ...prev, isChanging: false }));
    }, 500);
  };

  /**
   * Toggles dropdown open/closed state
   */
  const toggleDropdown = () => {
    if (disabled || isLoading) return;
    
    setState(prev => ({
      ...prev,
      isDropdownOpen: !prev.isDropdownOpen,
    }));
  };

  /**
   * Handles keyboard navigation
   * @param event - Keyboard event
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled || isLoading) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        toggleDropdown();
        break;
      case 'Escape':
        setState(prev => ({ ...prev, isDropdownOpen: false }));
        buttonRef.current?.focus();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!state.isDropdownOpen) {
          toggleDropdown();
        } else {
          // Focus first option
          const firstOption = dropdownRef.current?.querySelector('[role="option"]') as HTMLElement;
          firstOption?.focus();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!state.isDropdownOpen) {
          toggleDropdown();
        } else {
          // Focus last option
          const options = dropdownRef.current?.querySelectorAll('[role="option"]');
          const lastOption = options?.[options.length - 1] as HTMLElement;
          lastOption?.focus();
        }
        break;
    }
  };

  /**
   * Handles option keyboard navigation
   * @param event - Keyboard event
   * @param year - Year for this option
   */
  const handleOptionKeyDown = (event: React.KeyboardEvent, year: number) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleYearSelect(year);
        break;
      case 'Escape':
        setState(prev => ({ ...prev, isDropdownOpen: false }));
        buttonRef.current?.focus();
        break;
      case 'ArrowDown':
        event.preventDefault();
        const nextOption = (event.target as HTMLElement).nextElementSibling as HTMLElement;
        nextOption?.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        const prevOption = (event.target as HTMLElement).previousElementSibling as HTMLElement;
        prevOption?.focus();
        break;
    }
  };

  /**
   * Effect to handle click outside dropdown
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setState(prev => ({ ...prev, isDropdownOpen: false }));
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setState(prev => ({ ...prev, isDropdownOpen: false }));
      }
    };

    if (state.isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [state.isDropdownOpen]);

  /**
   * Update state when props change
   */
  useEffect(() => {
    setState(prev => ({
      ...prev,
      selectedYear,
      availableYears,
    }));
  }, [selectedYear, availableYears]);

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="text-sm text-github-text">
        Select year to view contribution history
      </div>
      
      <div className="relative" ref={dropdownRef}>
        <button
          ref={buttonRef}
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
          className={`
            flex items-center gap-2 px-4 py-2 bg-github-dark border border-github-border rounded-lg text-white 
            transition-colors focus:outline-none focus:ring-2 focus:ring-neon-green/20
            ${disabled || isLoading 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:border-neon-green/50 cursor-pointer'
            }
          `}
          aria-label="Select year"
          aria-expanded={state.isDropdownOpen}
          aria-haspopup="listbox"
        >
          <span className="font-medium">
            {isLoading ? 'Loading...' : selectedYear}
          </span>
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${
              state.isDropdownOpen ? 'rotate-180' : ''
            } ${isLoading ? 'animate-spin' : ''}`} 
          />
        </button>
        
        <AnimatePresence>
          {state.isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 bg-github-dark border border-github-border rounded-lg shadow-xl z-50 min-w-[120px] overflow-hidden"
              role="listbox"
              aria-label="Year options"
            >
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  onKeyDown={(e) => handleOptionKeyDown(e, year)}
                  className={`
                    w-full px-4 py-2 text-left transition-colors focus:outline-none
                    ${year === selectedYear 
                      ? 'bg-neon-green/10 text-neon-green' 
                      : 'text-white hover:bg-github-border hover:text-neon-green focus:bg-github-border'
                    }
                  `}
                  role="option"
                  aria-selected={year === selectedYear}
                  tabIndex={0}
                >
                  <div className="flex items-center justify-between">
                    <span>{year}</span>
                    {year === currentYear && (
                      <span className="text-xs text-github-text">(current)</span>
                    )}
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
