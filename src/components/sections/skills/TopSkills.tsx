
import { motion } from 'framer-motion';
import SkillIcon from '../SkillIcon';

type TopSkillProps = {
  skills: { name: string; level: number }[];
  onSkillHover: (element: HTMLElement, skill: string, isEntering: boolean) => void;
};

const TopSkills = ({ skills, onSkillHover }: TopSkillProps) => {
  return (
    <div className="mt-12">
      <h3 className="text-xl text-white font-bold mb-4">Top Skills at a Glance</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {skills.map((skill, index) => {
          const safeId = `top-skill-${skill.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${index}`;
          return (
            <motion.div
              key={safeId}
              id={safeId}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-github-light/30 p-3 rounded-lg text-center flex flex-col items-center transition-all duration-300 hover:bg-github-light/50"
              onMouseEnter={(e) => onSkillHover(e.currentTarget, skill.name, true)}
              onMouseLeave={(e) => onSkillHover(e.currentTarget, skill.name, false)}
            >
              <SkillIcon name={skill.name} color="#3fb950" />
              <span className="text-white mt-2">{skill.name}</span>
              <span className="text-neon-green text-sm">{skill.level}%</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TopSkills;
