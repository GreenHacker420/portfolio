export interface KeyMapEntry {
  slug: string; // e.g., 'javascript'
  label: string; // e.g., 'JavaScript'
}

// 24 skills in row-major order (4 rows x 6 cols)
export const SKILLS_24: { slug: string; label: string }[] = [
  { slug: 'javascript', label: 'JavaScript' },
  { slug: 'typescript', label: 'TypeScript' },
  { slug: 'html', label: 'HTML' },
  { slug: 'css', label: 'CSS' },
  { slug: 'react', label: 'React' },
  { slug: 'vue', label: 'Vue' },

  { slug: 'nextjs', label: 'Next.js' },
  { slug: 'tailwindcss', label: 'Tailwind CSS' },
  { slug: 'nodejs', label: 'Node.js' },
  { slug: 'express', label: 'Express' },
  { slug: 'postgresql', label: 'PostgreSQL' },
  { slug: 'mongodb', label: 'MongoDB' },

  { slug: 'git', label: 'Git' },
  { slug: 'github', label: 'GitHub' },
  { slug: 'code', label: 'Code' },
  { slug: 'mui', label: 'MUI' },
  { slug: 'supabase', label: 'Supabase' },
  { slug: 'wordpress', label: 'WordPress' },

  { slug: 'linux', label: 'Linux' },
  { slug: 'docker', label: 'Docker' },
  { slug: 'nginx', label: 'Nginx' },
  { slug: 'aws', label: 'AWS' },
  { slug: 'tensorflow', label: 'TensorFlow' },
  { slug: 'vercel', label: 'Vercel' },
];

function normalize(str: string) {
  return (str || '').toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9_]/g, '');
}

// Build grid key map: row{1..4}_key{1..6}
const GRID_KEYS: Record<string, KeyMapEntry> = {};
for (let r = 1; r <= 4; r++) {
  for (let c = 1; c <= 6; c++) {
    const idx = (r - 1) * 6 + (c - 1);
    const entry = SKILLS_24[idx];
    const key = `row${r}_key${c}`;
    GRID_KEYS[key] = { slug: entry.slug, label: entry.label };
  }
}

// Add aliases for direct skill-named objects, e.g., 'javascript_key', 'javascript'
const ALIASES: Record<string, KeyMapEntry> = {};
for (const entry of SKILLS_24) {
  const variants = [
    `${entry.slug}_key`,
    `${entry.slug}`,
    `${entry.slug}key`,
  ];
  for (const v of variants) {
    ALIASES[v] = { slug: entry.slug, label: entry.label };
  }
}

export function resolveKeyEntry(rawName: string | null | undefined): KeyMapEntry | undefined {
  const n = normalize(rawName || '');
  if (!n) return undefined;
  // Try exact grid key match first
  if (GRID_KEYS[n]) return GRID_KEYS[n];
  // Try aliases
  if (ALIASES[n]) return ALIASES[n];
  // Try patterns like 'row1key1' without underscore
  const m = n.match(/^row([1-4])key([1-6])$/);
  if (m) {
    const r = Number(m[1]);
    const c = Number(m[2]);
    const idx = (r - 1) * 6 + (c - 1);
    const entry = SKILLS_24[idx];
    if (entry) return { slug: entry.slug, label: entry.label };
  }
  return undefined;
}

