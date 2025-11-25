import { LucideIcon } from 'lucide-react';

// ================================
// WORK EXPERIENCE TYPES
// ================================

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
  companyLogo?: string;
  achievements?: string[];
  technologies?: string[];
  location?: string;
  employmentType?: EmploymentType;
}

export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';

// ================================
// EDUCATION TYPES
// ================================

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  honors?: string;
  description?: string;
  activities?: string[];
}

// ================================
// CERTIFICATION TYPES
// ================================

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  skills?: string[];
}

// ================================
// ACHIEVEMENT TYPES
// ================================

export interface AchievementItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  category?: AchievementCategory;
  issuer?: string;
  url?: string;
  imageUrl?: string;
}

export type AchievementCategory = 'award' | 'recognition' | 'milestone' | 'publication' | 'other';

// ================================
// TAB CONFIGURATION TYPES
// ================================

export interface TabConfig {
  id: ExperienceTabId;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  color: NeonColor;
}

export type ExperienceTabId = 'work' | 'education' | 'certifications' | 'achievements';

export type NeonColor = 'neon-green' | 'neon-purple' | 'neon-blue' | 'neon-pink';

// ================================
// COMPONENT PROPS TYPES
// ================================

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: NeonColor;
}

export interface ExperienceCardProps {
  item: ExperienceItem;
  isExpanded: boolean;
  onToggle: () => void;
  formatPeriod: (start: string, end?: string) => string;
}

export interface EducationCardProps {
  item: EducationItem;
  isExpanded: boolean;
  onToggle: () => void;
  formatPeriod: (start: string, end?: string) => string;
}

export interface CertificationCardProps {
  item: CertificationItem;
  formatDate: (date: string) => string;
}

export interface AchievementCardProps {
  item: AchievementItem;
  formatDate: (date: string) => string;
}

export interface TabNavigationProps {
  tabs: TabConfig[];
  activeTab: ExperienceTabId;
  onTabChange: (tabId: ExperienceTabId) => void;
  currentIndex: number;
}

// ================================
// ANIMATION TYPES
// ================================

export interface SwipeDirection {
  direction: 'left' | 'right' | null;
}

export interface AnimationVariants {
  hidden: { opacity: number; y?: number; x?: number };
  visible: { opacity: number; y?: number; x?: number };
}

// ================================
// API RESPONSE TYPES
// ================================

export interface ExperienceApiResponse {
  experiences: ExperienceItem[];
}

export interface EducationApiResponse {
  education: EducationItem[];
}

export interface CertificationsApiResponse {
  certifications: CertificationItem[];
}

export interface AchievementsApiResponse {
  achievements: AchievementItem[];
}

// ================================
// COLOR UTILITIES
// ================================

export const NEON_COLORS: Record<NeonColor, { bg: string; shadow: string; text: string }> = {
  'neon-green': {
    bg: '#3fb950',
    shadow: 'rgba(63, 185, 80, 0.5)',
    text: '#3fb950',
  },
  'neon-purple': {
    bg: '#bf4dff',
    shadow: 'rgba(191, 77, 255, 0.5)',
    text: '#bf4dff',
  },
  'neon-blue': {
    bg: '#1f6feb',
    shadow: 'rgba(31, 111, 235, 0.5)',
    text: '#1f6feb',
  },
  'neon-pink': {
    bg: '#f778ba',
    shadow: 'rgba(247, 120, 186, 0.5)',
    text: '#f778ba',
  },
};
