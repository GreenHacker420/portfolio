
'use client';

import ProjectPinCard from './ProjectPinCard';

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: string;
  technologies?: string[];
  tags?: string[]; // For backward compatibility
  featured: boolean;
  status: string;
  github_url?: string;
  live_url?: string;
  image_url?: string;
  imageUrl?: string; // For backward compatibility
  screenshots?: string[];
  start_date?: string;
  end_date?: string;
  highlights?: string[];
  created_at?: string;
  updated_at?: string;
}

type ProjectGridProps = {
  projects: Project[];
  filter: string;
};

const ProjectGrid = ({ projects, filter }: ProjectGridProps) => {
  // Filter projects based on selected category
  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(project => project.category === filter);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredProjects.map((project) => (
        <ProjectPinCard key={project.id} project={project as any} />
      ))}
    </div>
  );
};

export default ProjectGrid;
