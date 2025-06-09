// Unified skill types for both legacy and new API data

export interface Skill {
  id: string;
  name: string;
  description: string;
  logo: string;
  color: string;
  experience: number;
  proficiency: number;
  level?: number; // For new API compatibility
  projects: string[];
  strengths: string[];
  category: SkillCategory;
  displayOrder?: number;
  isVisible?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type SkillCategory = 
  | 'frontend' 
  | 'backend' 
  | 'language' 
  | 'database' 
  | 'devops' 
  | 'mobile' 
  | 'design' 
  | 'other';

// Legacy skill data structure for backward compatibility
export interface LegacySkillsData {
  categories: {
    name: string;
    description: string;
    skills: {
      name: string;
      color: string;
      level: number;
    }[];
  }[];
  topSkills: {
    name: string;
    level: number;
  }[];
}

// Transform API skill to legacy format
export function transformApiSkillToLegacy(apiSkill: any): Skill {
  return {
    id: apiSkill.id,
    name: apiSkill.name,
    description: apiSkill.description || '',
    logo: apiSkill.logo || '',
    color: apiSkill.color,
    experience: apiSkill.experience || 0,
    proficiency: apiSkill.level || apiSkill.proficiency || 0,
    level: apiSkill.level,
    projects: apiSkill.projects || [],
    strengths: apiSkill.strengths || [],
    category: apiSkill.category,
    displayOrder: apiSkill.displayOrder,
    isVisible: apiSkill.isVisible,
    createdAt: apiSkill.createdAt,
    updatedAt: apiSkill.updatedAt,
  };
}
