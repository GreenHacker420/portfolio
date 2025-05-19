
import { motion } from 'framer-motion';
import SkillItem from './SkillItem';

type Skill = {
  name: string;
  color: string;
  level: number;
};

type SkillCategoryProps = {
  category: {
    name: string;
    description: string;
    skills: Skill[];
  };
  hoveredSkill: string | null;
  onSkillHover: (element: HTMLElement, skill: string, isEntering: boolean) => void;
};

const SkillCategory = ({ category, hoveredSkill, onSkillHover }: SkillCategoryProps) => {
  return (
    <>
      <div className="bg-github-light/20 rounded-lg p-4 mb-6">
        <h3 className="text-xl text-white font-medium mb-2">
          {category.name}
        </h3>
        <p className="text-github-text">
          {category.description}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 skills-grid">
        {category.skills.map((skill, index) => (
          <SkillItem 
            key={`${skill.name}-${index}`}
            skill={skill}
            index={index}
            isHovered={hoveredSkill === skill.name}
            onHover={onSkillHover}
          />
        ))}
      </div>
    </>
  );
};

export default SkillCategory;
