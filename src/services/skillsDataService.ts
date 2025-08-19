// Skills data service that uses database API only
import { Skill, transformApiSkillToLegacy } from '../types/skills';
import { fetchSkills } from './skillsService';
import { FALLBACK_SKILLS } from '../components/sections/skills/keyboard/constants/fallbackSkills';

// Cache for transformed skills
let skillsCache: Skill[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get all skills from database API
export async function getAllSkills(): Promise<Skill[]> {
  // Check cache first
  const now = Date.now();
  if (skillsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return skillsCache;
  }

  try {
    // Fetch from API
    const { skills: apiSkills } = await fetchSkills();
    const transformedSkills = apiSkills.map(transformApiSkillToLegacy);

    // Update cache
    skillsCache = transformedSkills;
    cacheTimestamp = now;

    return transformedSkills;
  } catch (error) {
    console.error('Failed to fetch skills from API:', error);

    // Return cached data if available
    if (skillsCache) {
      return skillsCache;
    }

    // Throw error if no cache available
    throw error;
  }
}

// Get skill by ID
export async function getSkillById(id: string): Promise<Skill | undefined> {
  try {
    const skills = await getAllSkills();
    return skills.find(skill => skill.id === id);
  } catch (error) {
    console.error('Error getting skill by ID:', error);
    throw error;
  }
}

// Get skills by category
export async function getSkillsByCategory(category: string): Promise<Skill[]> {
  try {
    const skills = await getAllSkills();
    return skills.filter(skill => skill.category === category);
  } catch (error) {
    console.error('Error getting skills by category:', error);
    throw error;
  }
}

// Sync functions for cached data only
export function getSkillByIdSync(id: string): Skill | undefined {
  if (skillsCache) {
    return skillsCache.find(skill => skill.id === id);
  }
  return undefined;
}

function normalizeName(s: string) {
  return s.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
}

export function getSkillBySlugSync(slug: string): Skill | undefined {
  const target = normalizeName(slug);
  if (skillsCache && skillsCache.length) {
    const found = skillsCache.find((skill) => {
      const n1 = normalizeName(skill.id);
      const n2 = normalizeName(skill.name);
      return n1 === target || n2 === target;
    });
    if (found) return found;
  }
  // Fallback local data if cache empty or missing entry
  try {
    const { FALLBACK_SKILLS } = require('../components/sections/skills/keyboard/constants/fallbackSkills');
    return FALLBACK_SKILLS[slug];
  } catch {
    return undefined;
  }
}

export function getAllSkillsSync(): Skill[] {
  return skillsCache || [];
}

// Clear cache
export function clearSkillsCache(): void {
  skillsCache = null;
  cacheTimestamp = 0;
}
