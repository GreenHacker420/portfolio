export interface KeyMapEntry {
  id: string;
  label: string;
}

export const KEY_MAP: Record<string, KeyMapEntry> = {
  javascript_key: { id: 'javascript', label: 'JavaScript' },
  typescript_key: { id: 'typescript', label: 'TypeScript' },
  html_key: { id: 'html', label: 'HTML' },
  css_key: { id: 'css', label: 'CSS' },
  react_key: { id: 'react', label: 'React' },
  vue_key: { id: 'vue', label: 'Vue.js' },
  nextjs_key: { id: 'nextjs', label: 'Next.js' },
  tailwind_key: { id: 'tailwindcss', label: 'Tailwind CSS' },
  nodejs_key: { id: 'nodejs', label: 'Node.js' },
  express_key: { id: 'express', label: 'Express.js' },
  postgres_key: { id: 'postgresql', label: 'PostgreSQL' },
  mongodb_key: { id: 'mongodb', label: 'MongoDB' },
  git_key: { id: 'git', label: 'Git' },
  github_key: { id: 'github', label: 'GitHub' },
  code_key: { id: 'code', label: 'Code' },
  mui_key: { id: 'mui', label: 'MUI' },
  supabase_key: { id: 'supabase', label: 'Supabase' },
  wordpress_key: { id: 'wordpress', label: 'WordPress' },
  linux_key: { id: 'linux', label: 'Linux' },
  docker_key: { id: 'docker', label: 'Docker' },
  nginx_key: { id: 'nginx', label: 'Nginx' },
  aws_key: { id: 'aws', label: 'AWS' },
  tensorflow_key: { id: 'tensorflow', label: 'TensorFlow' },
  vercel_key: { id: 'vercel', label: 'Vercel' },
};

