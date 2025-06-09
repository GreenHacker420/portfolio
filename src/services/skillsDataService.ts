// Unified skills data service that provides both legacy and new API access
import { Skill, transformApiSkillToLegacy } from '../types/skills';
import { skills as legacySkills } from '../data/skillsData';
import { fetchSkills } from './skillsService';

// Cache for transformed skills
let skillsCache: Skill[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get all skills with fallback to legacy data
export async function getAllSkills(): Promise<Skill[]> {
  // Check cache first
  const now = Date.now();
  if (skillsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return skillsCache;
  }

  try {
    // Try to fetch from API
    const { skills: apiSkills } = await fetchSkills();
    const transformedSkills = apiSkills.map(transformApiSkillToLegacy);
    
    // Update cache
    skillsCache = transformedSkills;
    cacheTimestamp = now;
    
    return transformedSkills;
  } catch (error) {
    console.error('Failed to fetch skills from API, using legacy data:', error);
    
    // Return cached data if available
    if (skillsCache) {
      return skillsCache;
    }
    
    // Fallback to legacy skills data
    return legacySkills;
  }
}

// Get skill by ID with fallback
export async function getSkillById(id: string): Promise<Skill | undefined> {
  try {
    const skills = await getAllSkills();
    return skills.find(skill => skill.id === id);
  } catch (error) {
    console.error('Error getting skill by ID:', error);
    // Fallback to legacy data
    return legacySkills.find(skill => skill.id === id);
  }
}

// Get skills by category with fallback
export async function getSkillsByCategory(category: string): Promise<Skill[]> {
  try {
    const skills = await getAllSkills();
    return skills.filter(skill => skill.category === category);
  } catch (error) {
    console.error('Error getting skills by category:', error);
    // Fallback to legacy data
    return legacySkills.filter(skill => skill.category === category);
  }
}

// Legacy compatibility functions
export function getSkillByIdSync(id: string): Skill | undefined {
  // Use cached data if available, otherwise use legacy data
  if (skillsCache) {
    return skillsCache.find(skill => skill.id === id);
  }
  return legacySkills.find(skill => skill.id === id);
}

export function getAllSkillsSync(): Skill[] {
  // Use cached data if available, otherwise use legacy data
  return skillsCache || legacySkills;
}

// Clear cache
export function clearSkillsCache(): void {
  skillsCache = null;
  cacheTimestamp = 0;
}

// Initialize cache with legacy data
export function initializeWithLegacyData(): void {
  if (!skillsCache) {
    skillsCache = legacySkills;
    cacheTimestamp = Date.now();
  }
}
