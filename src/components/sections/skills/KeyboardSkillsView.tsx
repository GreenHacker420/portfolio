
import { motion } from 'framer-motion';
import KeyboardSkills from './KeyboardSkills';

const KeyboardSkillsView = () => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="my-8"
      >
        <KeyboardSkills />
      </motion.div>
      
      <motion.div 
        className="text-center mt-8 text-github-text"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-neon-green">(hint: press a key)</p>
      </motion.div>
    </>
  );
};

export default KeyboardSkillsView;
