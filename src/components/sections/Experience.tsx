
import ExperienceClient from './ExperienceClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

async function getData(endpoint: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/${endpoint}`, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`Failed to fetch ${endpoint}: ${res.statusText}`);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
}

const Experience = async () => {
  const [experiences, education, certifications, achievements] = await Promise.all([
    getData('experience'),
    getData('education'),
    getData('certifications'),
    getData('achievements'),
  ]);

  return (
    <section id="experience" className="py-20 bg-github-dark">
      <ExperienceClient
        experiences={experiences}
        education={education}
        certifications={certifications}
        achievements={achievements}
      />
    </section>
  );
};

export default Experience;
