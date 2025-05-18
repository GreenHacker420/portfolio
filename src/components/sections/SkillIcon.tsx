
import { HTMLAttributes } from 'react';
import * as icons from 'lucide-react';

interface SkillIconProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  color?: string;
}

const SkillIcon = ({ name, color, ...props }: SkillIconProps) => {
  // Map of skill names to corresponding Lucide icons
  const iconMap: Record<string, keyof typeof icons> = {
    // Programming Languages
    "C++": "code-2",
    "DART": "code",
    "JAVASCRIPT": "javascript",
    "PYTHON": "file-code",
    "TYPESCRIPT": "typescript",
    "RUST": "file-code",
    "POWERSHELL": "terminal",
    "BASH SCRIPT": "terminal",
    
    // Frontend
    "HTML5": "html",
    "CSS3": "css",
    "REACT": "react",
    "REACT NATIVE": "react",
    "ANGULAR": "code",
    "VUE.JS": "code",
    "BOOTSTRAP": "layout-dashboard",
    "TAILWINDCSS": "tailwind",
    "NEXT": "nextjs",
    "IONIC": "code",
    
    // Backend
    "NODE.JS": "nodejs",
    "EXPRESS.JS": "server",
    "DJANGO": "server",
    "FLASK": "server",
    "FASTAPI": "server",
    "SPRING": "server",
    
    // Cloud & Deployment
    "AWS": "cloud",
    "AZURE": "cloud",
    "FIREBASE": "database",
    "GOOGLECLOUD": "cloud",
    "NETLIFY": "cloud",
    "RENDER": "cloud",
    "VERCEL": "cloud",
    
    // Databases
    "MYSQL": "database",
    "SQLITE": "database",
    "MONGODB": "mongodb",
    "SUPABASE": "database",
    
    // DevOps & Tools
    "GITHUB ACTIONS": "github",
    "GIT": "git",
    "DOCKER": "docker",
    "POSTMAN": "api",
    "KUBERNETES": "code",
    "GITHUB": "github",
    
    // Data Science & ML
    "MATPLOTLIB": "chart-bar",
    "NUMPY": "table",
    "PANDAS": "table",
    "TENSORFLOW": "code",
    "PYTORCH": "code",
    
    // UI/UX & Design
    "FIGMA": "figma",
    "CANVA": "image",
    "BLENDER": "video",
    "ADOBE CREATIVE CLOUD": "image",
    "ADOBE PHOTOSHOP": "image"
  };

  // Get the icon component
  const iconName = iconMap[name] || "code";
  const IconComponent = icons[iconName as keyof typeof icons];

  // Generate a default color if not provided
  const iconColor = color || "#c9d1d9";

  return (
    <div 
      className="skill-icon flex items-center justify-center p-2 rounded-md bg-github-darker"
      {...props}
    >
      {IconComponent && <IconComponent size={24} color={iconColor} className="skill-icon-svg" />}
    </div>
  );
};

export default SkillIcon;
