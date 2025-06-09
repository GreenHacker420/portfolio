
import data from '../data/data.json';
import { fetchSkills, transformSkillsForLegacyComponents } from '../services/skillsService';

// Legacy function for backward compatibility
export const getSkillsData = () => {
  return data.skills;
};

// New function that fetches from database
export const getSkillsDataFromDB = async () => {
  try {
    const { skills } = await fetchSkills();
    return transformSkillsForLegacyComponents(skills);
  } catch (error) {
    console.error('Failed to fetch skills from database, falling back to static data:', error);
    return data.skills;
  }
};

export const getProjectsData = () => {
  return data.projects;
};
