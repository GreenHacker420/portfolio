import { GITHUB_API_ENDPOINTS, type GitHubData, type GitHubRepo } from '@/types/github';

export interface InferredSkillData {
  id: string;
  name: string;
  description: string;
  category: string;
  level: number; // 1-100
  color: string;
  logo?: string;
  experience?: number;
  projects: string[];
  strengths: string[];
  displayOrder: number;
  isVisible: boolean;
}

const SKILL_SLUGS = [
  'javascript','typescript','html','css','react','vue',
  'nextjs','tailwindcss','nodejs','express','postgresql','mongodb',
  'git','github','code','mui','supabase','wordpress',
  'linux','docker','nginx','aws','tensorflow','vercel'
] as const;

const SKILL_META: Record<string, { name: string; category: string; color: string }> = {
  javascript: { name: 'JavaScript', category: 'language', color: '#F7DF1E' },
  typescript: { name: 'TypeScript', category: 'language', color: '#3178C6' },
  html: { name: 'HTML', category: 'frontend', color: '#E34F26' },
  css: { name: 'CSS', category: 'frontend', color: '#1572B6' },
  react: { name: 'React', category: 'frontend', color: '#61DAFB' },
  vue: { name: 'Vue', category: 'frontend', color: '#42B883' },
  nextjs: { name: 'Next.js', category: 'frontend', color: '#000000' },
  tailwindcss: { name: 'Tailwind CSS', category: 'frontend', color: '#38B2AC' },
  nodejs: { name: 'Node.js', category: 'backend', color: '#68A063' },
  express: { name: 'Express', category: 'backend', color: '#444444' },
  postgresql: { name: 'PostgreSQL', category: 'database', color: '#336791' },
  mongodb: { name: 'MongoDB', category: 'database', color: '#47A248' },
  git: { name: 'Git', category: 'other', color: '#F05032' },
  github: { name: 'GitHub', category: 'other', color: '#181717' },
  code: { name: 'Code', category: 'other', color: '#22C55E' },
  mui: { name: 'MUI', category: 'frontend', color: '#007FFF' },
  supabase: { name: 'Supabase', category: 'backend', color: '#3ECF8E' },
  wordpress: { name: 'WordPress', category: 'other', color: '#21759B' },
  linux: { name: 'Linux', category: 'other', color: '#FCC624' },
  docker: { name: 'Docker', category: 'devops', color: '#2496ED' },
  nginx: { name: 'Nginx', category: 'devops', color: '#009639' },
  aws: { name: 'AWS', category: 'devops', color: '#FF9900' },
  tensorflow: { name: 'TensorFlow', category: 'other', color: '#FF6F00' },
  vercel: { name: 'Vercel', category: 'other', color: '#000000' },
};

function scoreFromRepo(repo: GitHubRepo, slug: string) {
  let s = 0;
  const lang = (repo.language || '').toLowerCase();
  if (lang.includes('javascript') && slug==='javascript') s += 12;
  if (lang.includes('typescript') && slug==='typescript') s += 12;
  if (lang.includes('html') && slug==='html') s += 8;
  if (lang.includes('css') && slug==='css') s += 8;
  if (lang.includes('python') && slug==='tensorflow') s += 5; // proxy signal
  // stars & recency
  s += Math.min(10, repo.stargazers_count || 0) * 1.0;
  const pushed = repo.pushed_at ? new Date(repo.pushed_at).getTime() : 0;
  const ageMonths = pushed ? (Date.now() - pushed) / (1000*60*60*24*30) : 24;
  s += Math.max(0, 12 - Math.min(12, ageMonths));
  return s;
}

function levelFromScore(total: number) {
  return Math.max(20, Math.min(97, Math.round(total))); // clamp 20..97
}

export async function inferSkillsFromGitHub(): Promise<InferredSkillData[]> {
  const res = await fetch(`${GITHUB_API_ENDPOINTS.AGGREGATE}`);
  const body = await res.json();
  if (!body?.success) {
    throw new Error(body?.error || 'Failed to fetch GitHub aggregate');
  }
  const data = body.data as GitHubData;
  const repos = data.repositories || [];

  // Aggregate scores
  const scores: Record<string, number> = Object.fromEntries(SKILL_SLUGS.map(s => [s, 0]));
  const projectsBySkill: Record<string, string[]> = Object.fromEntries(SKILL_SLUGS.map(s => [s, []]));

  for (const repo of repos) {
    for (const slug of SKILL_SLUGS) {
      const delta = scoreFromRepo(repo, slug);
      scores[slug] += delta;
      if (delta > 0) projectsBySkill[slug].push(repo.name);
    }
  }

  // Normalize and build inferred skills
  const maxScore = Math.max(1, ...Object.values(scores));
  const inferred: InferredSkillData[] = SKILL_SLUGS.map((slug, i) => {
    const meta = SKILL_META[slug];
    const rel = scores[slug] / maxScore;
    const level = levelFromScore(rel * 100);
    const topProjects = Array.from(new Set(projectsBySkill[slug])).slice(0, 6);
    const strengths: string[] = [];
    if (level > 80) strengths.push('Advanced');
    else if (level > 60) strengths.push('Proficient');
    else strengths.push('Intermediate');

    const description = `${meta.name} proficiency inferred from GitHub activity across ${topProjects.length} project(s). Stars, recency, and language usage contributed to this score.`;

    return {
      id: slug,
      name: meta.name,
      description,
      category: meta.category,
      level,
      color: meta.color,
      logo: '',
      experience: 0,
      projects: topProjects,
      strengths,
      displayOrder: i + 1,
      isVisible: true,
    };
  });

  return inferred;
}

