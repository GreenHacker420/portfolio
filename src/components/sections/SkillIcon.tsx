
import { HTMLAttributes } from 'react';
import * as icons from 'lucide-react';

interface SkillIconProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  color?: string;
}

// Type for the icon mapping
type IconName = keyof typeof icons;

const SkillIcon = ({ name, color, ...props }: SkillIconProps) => {
  // Map of skill names to corresponding Lucide icons with correct casing
  const iconMap: Record<string, IconName> = {
    // Programming Languages
    "C++": "Code2",
    "DART": "Code",
    "JAVASCRIPT": "Code",
    "PYTHON": "FileCode",
    "TYPESCRIPT": "Code",
    "RUST": "FileCode",
    "POWERSHELL": "Terminal",
    "BASH SCRIPT": "Terminal",
    
    // Frontend
    "HTML5": "Code",
    "CSS3": "Code",
    "REACT": "Code",
    "REACT NATIVE": "Code",
    "ANGULAR": "Code",
    "VUE.JS": "Code",
    "BOOTSTRAP": "LayoutDashboard",
    "TAILWINDCSS": "Code",
    "NEXT": "Code",
    "IONIC": "Code",
    
    // Backend
    "NODE.JS": "Server",
    "EXPRESS.JS": "Server",
    "DJANGO": "Server",
    "FLASK": "Server",
    "FASTAPI": "Server",
    "SPRING": "Server",
    
    // Cloud & Deployment
    "AWS": "Cloud",
    "AZURE": "Cloud",
    "FIREBASE": "Database",
    "GOOGLECLOUD": "Cloud",
    "NETLIFY": "Cloud",
    "RENDER": "Cloud",
    "VERCEL": "Cloud",
    
    // Databases
    "MYSQL": "Database",
    "SQLITE": "Database",
    "MONGODB": "Database",
    "SUPABASE": "Database",
    
    // DevOps & Tools
    "GITHUB ACTIONS": "Github",
    "GIT": "Github",
    "DOCKER": "Code",
    "POSTMAN": "Code",
    "KUBERNETES": "Code",
    "GITHUB": "Github",
    
    // Data Science & ML
    "MATPLOTLIB": "ChartBar",
    "NUMPY": "Table",
    "PANDAS": "Table",
    "TENSORFLOW": "Code",
    "PYTORCH": "Code",
    
    // UI/UX & Design
    "FIGMA": "Code",
    "CANVA": "Image",
    "BLENDER": "Code",
    "ADOBE CREATIVE CLOUD": "Image",
    "ADOBE PHOTOSHOP": "Image"
  };

  // Get the icon component - ensure it's a valid icon, defaulting to Code if not found
  const iconName = iconMap[name] || "Code";
  
  // Type assertion to ensure TypeScript knows this is a valid component
  const IconComponent = icons[iconName] as React.ComponentType<{ size?: number, color?: string, className?: string }>;

  // Generate a default color if not provided
  const iconColor = color || "#c9d1d9";

  return (
    <div 
      className="skill-icon flex items-center justify-center p-2 rounded-md bg-github-darker"
      {...props}
    >
      <IconComponent size={24} color={iconColor} className="skill-icon-svg" />
    </div>
  );
};

export default SkillIcon;
