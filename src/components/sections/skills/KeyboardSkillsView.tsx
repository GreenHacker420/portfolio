
import { motion } from 'framer-motion';
import KeyboardSkills from './KeyboardSkills';
import { useState } from 'react';
import { Skill } from '../../../data/skillsData';

const KeyboardSkillsView = () => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // Handle skill selection from the keyboard
  const handleSkillSelect = (skill: Skill | null) => {
    setSelectedSkill(skill);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="my-4 w-full flex flex-col items-center justify-center"
      >
        <div className="w-full max-w-4xl mx-auto">
          <KeyboardSkills onSkillSelect={handleSkillSelect} />
        </div>
      </motion.div>
      
      <motion.div 
        className="text-center mt-2 text-github-text"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-neon-green">(press a key to view skill details)</p>
      </motion.div>
    </>
  );
};

export default KeyboardSkillsView;
