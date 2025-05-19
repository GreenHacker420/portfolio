
import { motion } from 'framer-motion';
import SkillIcon from '../SkillIcon';

type SkillItemProps = {
  skill: {
    name: string;
    color: string;
    level: number;
  };
  index: number;
  isHovered: boolean;
  onHover: (element: HTMLElement, skill: string, isEntering: boolean) => void;
};

const SkillItem = ({ skill, index, isHovered, onHover }: SkillItemProps) => {
  // Create a safe id that can be used with element selectors
  const safeId = `skill-${skill.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${index}`;
  
  return (
    <motion.div
      id={safeId}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="bg-github-light rounded-lg p-4 border border-github-border skill-item transition-all duration-300"
      onMouseEnter={(e) => onHover(e.currentTarget, skill.name, true)}
      onMouseLeave={(e) => onHover(e.currentTarget, skill.name, false)}
    >
      <div className="flex items-center gap-3 mb-3">
        <SkillIcon 
          name={skill.name} 
          color={isHovered ? "#3fb950" : undefined} 
        />
        <div className="flex justify-between items-center w-full">
          <span className="text-white font-medium">{skill.name}</span>
          <span className="text-sm text-neon-green">{skill.level}%</span>
        </div>
      </div>
      <div className="w-full bg-github-dark rounded-full h-2.5">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className={`h-2.5 rounded-full ${skill.color}`}
        ></motion.div>
      </div>
    </motion.div>
  );
};

export default SkillItem;
