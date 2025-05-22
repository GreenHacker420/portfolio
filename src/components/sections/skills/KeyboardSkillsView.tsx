
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
        {/* Display selected skill info at the top */}
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-2">{selectedSkill.name}</h3>
            <p className="text-github-text max-w-xl">{selectedSkill.description}</p>
          </motion.div>
        )}
        
        <div className="w-full max-w-4xl mx-auto">
          <KeyboardSkills onSkillSelect={handleSkillSelect} />
        </div>
      </motion.div>
      
      {/* Hint text */}
      <motion.div 
        className="text-center mt-2 text-white/70 font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p>(hint: press a key to explore skills)</p>
      </motion.div>
    </>
  );
};

export default KeyboardSkillsView;
