/**
 * Common Type Definitions
 * Shared types used across multiple components
 */

import { LucideIcon } from 'lucide-react';

// ================================
// ANIMATION TYPES
// ================================

export interface MotionVariants {
  hidden: Record<string, number | string>;
  visible: Record<string, number | string>;
  exit?: Record<string, number | string>;
}

export interface TransitionConfig {
  duration?: number;
  delay?: number;
  ease?: string | number[];
  staggerChildren?: number;
}

// ================================
// UI COMPONENT TYPES
// ================================

export interface BaseCardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
}

export interface SectionProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

export interface EmptyStateBaseProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ================================
// LOADING STATES
// ================================

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface AsyncState<T> extends LoadingState {
  data: T | null;
}

// ================================
// FORM TYPES
// ================================

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    message?: string;
  };
}

// ================================
// RESPONSIVE BREAKPOINTS
// ================================

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export const BREAKPOINTS: Record<Breakpoint, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// ================================
// THEME TYPES
// ================================

export type ThemeColor = 
  | 'github-dark'
  | 'github-darker'
  | 'github-light'
  | 'github-text'
  | 'github-border'
  | 'neon-green'
  | 'neon-purple'
  | 'neon-blue'
  | 'neon-pink';

export interface ThemeColors {
  github: {
    dark: string;
    darker: string;
    light: string;
    text: string;
    border: string;
  };
  neon: {
    green: string;
    purple: string;
    blue: string;
    pink: string;
  };
}

// ================================
// API TYPES
// ================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ================================
// DATE FORMATTING
// ================================

export interface DateFormatOptions {
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  day?: 'numeric' | '2-digit';
}

// ================================
// SOCIAL LINKS
// ================================

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
  username?: string;
  isVisible?: boolean;
}

export type SocialPlatform = 
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'dribbble'
  | 'behance'
  | 'medium'
  | 'dev'
  | 'email';

// ================================
// NAVIGATION TYPES
// ================================

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: LucideIcon;
  isExternal?: boolean;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}
