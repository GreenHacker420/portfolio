import type { Skill } from '../../../../../types/skills';

// Minimal fallback data for the 24 mapped skills when DB entries are missing.
// This helps tooltips/modals still show information while you populate the database.

export const FALLBACK_SKILLS: Record<string, Skill> = {
  javascript: mk('javascript', 'JavaScript', 'language', '#F7DF1E'),
  typescript: mk('typescript', 'TypeScript', 'language', '#3178C6'),
  html: mk('html', 'HTML', 'frontend', '#E34F26'),
  css: mk('css', 'CSS', 'frontend', '#1572B6'),
  react: mk('react', 'React', 'frontend', '#61DAFB'),
  vue: mk('vue', 'Vue', 'frontend', '#42B883'),

  nextjs: mk('nextjs', 'Next.js', 'frontend', '#000000'),
  tailwindcss: mk('tailwindcss', 'Tailwind CSS', 'frontend', '#38B2AC'),
  nodejs: mk('nodejs', 'Node.js', 'backend', '#68A063'),
  express: mk('express', 'Express', 'backend', '#444444'),
  postgresql: mk('postgresql', 'PostgreSQL', 'database', '#336791'),
  mongodb: mk('mongodb', 'MongoDB', 'database', '#47A248'),

  git: mk('git', 'Git', 'other', '#F05032'),
  github: mk('github', 'GitHub', 'other', '#181717'),
  code: mk('code', 'Code', 'other', '#22C55E'),
  mui: mk('mui', 'MUI', 'frontend', '#007FFF'),
  supabase: mk('supabase', 'Supabase', 'backend', '#3ECF8E'),
  wordpress: mk('wordpress', 'WordPress', 'other', '#21759B'),

  linux: mk('linux', 'Linux', 'other', '#FCC624'),
  docker: mk('docker', 'Docker', 'devops', '#2496ED'),
  nginx: mk('nginx', 'Nginx', 'devops', '#009639'),
  aws: mk('aws', 'AWS', 'devops', '#FF9900'),
  tensorflow: mk('tensorflow', 'TensorFlow', 'other', '#FF6F00'),
  vercel: mk('vercel', 'Vercel', 'other', '#000000'),
};

function mk(id: string, name: string, category: any, color: string): Skill {
  return {
    id,
    name,
    description: `${name} details coming soon. (fallback)`,
    logo: '',
    color,
    experience: 0,
    proficiency: 80, // fallback nominal value out of 100
    level: 80,
    projects: [],
    strengths: [],
    category,
    displayOrder: 0,
    isVisible: true,
  };
}

