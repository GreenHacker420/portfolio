// Service for fetching skills data from the API
export interface SkillFromAPI {
  id: string;
  name: string;
  description: string;
  logo: string;
  color: string;
  experience: number;
  proficiency: number;
  level: number;
  projects: string[];
  strengths: string[];
  category: 'frontend' | 'backend' | 'language' | 'database' | 'devops' | 'mobile' | 'design' | 'other';
  displayOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SkillsResponse {
  skills: SkillFromAPI[];
  total: number;
}

// Cache for skills data
let skillsCache: SkillsResponse | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchSkills(): Promise<SkillsResponse> {
  // Check if we have valid cached data
  const now = Date.now();
  if (skillsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return skillsCache;
  }

  try {
    const response = await fetch('/api/skills', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch skills: ${response.status}`);
    }

    const data: SkillsResponse = await response.json();
    
    // Update cache
    skillsCache = data;
    cacheTimestamp = now;
    
    return data;
  } catch (error) {
    console.error('Error fetching skills:', error);
    
    // Return cached data if available, otherwise throw
    if (skillsCache) {
      console.warn('Using cached skills data due to fetch error');
      return skillsCache;
    }
    
    throw error;
  }
}

export async function getSkillById(id: string): Promise<SkillFromAPI | undefined> {
  const { skills } = await fetchSkills();
  return skills.find(skill => skill.id === id);
}

export async function getSkillsByCategory(category: string): Promise<SkillFromAPI[]> {
  const { skills } = await fetchSkills();
  return skills.filter(skill => skill.category === category);
}

export async function getTopSkills(limit: number = 10): Promise<SkillFromAPI[]> {
  const { skills } = await fetchSkills();
  return skills
    .sort((a, b) => b.level - a.level)
    .slice(0, limit);
}

// Clear cache (useful for admin operations)
export function clearSkillsCache(): void {
  skillsCache = null;
  cacheTimestamp = 0;
}

// Transform skills data to match the legacy format for backward compatibility
export function transformSkillsForLegacyComponents(skills: SkillFromAPI[]) {
  return {
    categories: groupSkillsByCategory(skills),
    topSkills: getTopSkillsSync(skills)
  };
}

function groupSkillsByCategory(skills: SkillFromAPI[]) {
  const categoryMap = new Map<string, SkillFromAPI[]>();
  
  skills.forEach(skill => {
    if (!categoryMap.has(skill.category)) {
      categoryMap.set(skill.category, []);
    }
    categoryMap.get(skill.category)!.push(skill);
  });

  return Array.from(categoryMap.entries()).map(([name, categorySkills]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    description: getCategoryDescription(name),
    skills: categorySkills.map(skill => ({
      name: skill.name,
      color: getColorClass(skill.color),
      level: skill.level
    }))
  }));
}

function getTopSkillsSync(skills: SkillFromAPI[]) {
  return skills
    .sort((a, b) => b.level - a.level)
    .slice(0, 10)
    .map(skill => ({
      name: skill.name,
      level: skill.level
    }));
}

function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    frontend: 'Technologies for building user interfaces and client-side applications',
    backend: 'Server-side technologies and API development',
    language: 'Programming languages and core development skills',
    database: 'Database management and data storage solutions',
    devops: 'Development operations, deployment, and infrastructure',
    mobile: 'Mobile application development technologies',
    design: 'Design tools and user experience technologies',
    other: 'Additional tools and technologies'
  };
  
  return descriptions[category] || 'Various technologies and tools';
}

function getColorClass(hexColor: string): string {
  // Map hex colors to Tailwind classes for backward compatibility
  const colorMap: Record<string, string> = {
    '#F7DF1E': 'bg-yellow-500',
    '#3178C6': 'bg-blue-700',
    '#61DAFB': 'bg-blue-400',
    '#339933': 'bg-green-600',
    '#3776AB': 'bg-blue-500',
    '#FF9900': 'bg-orange-500',
    '#2496ED': 'bg-blue-600',
    '#47A248': 'bg-green-500',
    '#336791': 'bg-blue-800',
    '#E10098': 'bg-pink-500',
    '#4FC08D': 'bg-green-400',
    '#06B6D4': 'bg-cyan-500',
    '#000000': 'bg-gray-900',
    '#F05032': 'bg-red-500'
  };
  
  return colorMap[hexColor] || 'bg-blue-600';
}
