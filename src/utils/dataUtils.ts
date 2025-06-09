
import { fetchSkills, transformSkillsForLegacyComponents } from '../services/skillsService';

// Function that fetches skills from database
export const getSkillsDataFromDB = async () => {
  try {
    const { skills } = await fetchSkills();
    return transformSkillsForLegacyComponents(skills);
  } catch (error) {
    console.error('Failed to fetch skills from database:', error);
    throw error;
  }
};

// Function to fetch projects from API
export const getProjectsDataFromAPI = async () => {
  try {
    const response = await fetch('/api/projects');
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data.projects || [];
  } catch (error) {
    console.error('Failed to fetch projects from API:', error);
    throw error;
  }
};
