import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import HighlightItem from './HighlightItem';
import { generateResumeHighlight } from '../../../utils/geminiService';
import type { GeminiHighlightResponse } from '../../../utils/geminiService';

const HighlightsList = () => {
  const [highlights, setHighlights] = useState<GeminiHighlightResponse[]>([
    {
      highlight: "Full Stack Development with React, Next.js, Node.js, TypeScript, JavaScript and Python",
      category: "Development",
      icon: "award"
    },
    {
      highlight: "Machine Learning specialization with PyTorch and TensorFlow",
      category: "AI/ML",
      icon: "book-open"
    },
    {
      highlight: "2+ years experience working with distributed teams",
      category: "Experience",
      icon: "coffee"
    },
    {
      highlight: "Open Source contributor to various GitHub projects",
      category: "Community",
      icon: "award"
    },
    {
      highlight: "Conference speaker on AI, web technologies and Computer Vision",
      category: "Speaking",
      icon: "book-open"
    }
  ]);
  
  const [selectedHighlight, setSelectedHighlight] = useState<number | null>(null);
  const [isGeneratingHighlight, setIsGeneratingHighlight] = useState(false);

  // Generate new highlight using Gemini AI
  const generateNewHighlight = async () => {
    setIsGeneratingHighlight(true);

    try {
      const resumeContext = 
        "Full Stack Developer skilled in React, Next.js, TypeScript, Node.js, AI integration, and modern web practices.";
      
      const newHighlight = await generateResumeHighlight(resumeContext);

      // Prevent duplicates
      if (highlights.some(h => h.highlight === newHighlight.highlight)) {
        toast.info("This highlight already exists");
        return;
      }

      setHighlights(prev => [...prev, newHighlight]);
      toast.success("✨ New highlight added!");
    } catch (error) {
      console.error("Error generating highlight:", error);
      if (error instanceof Error) {
        toast.error(error.message, {
          action: {
            label: "Retry",
            onClick: generateNewHighlight
          }
        });
      } else {
        toast.error("Failed to generate highlight");
      }
    } finally {
      setIsGeneratingHighlight(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
      className="bg-github-light rounded-lg p-6 border border-github-border"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Highlights</h3>
        <button 
          onClick={generateNewHighlight}
          disabled={isGeneratingHighlight}
          className="px-3 py-1 bg-neon-purple/20 text-neon-purple text-xs rounded-full hover:bg-neon-purple/30 transition-colors flex items-center gap-1"
          aria-live="polite"
        >
          {isGeneratingHighlight ? (
            <>
              <span className="h-2 w-2 bg-neon-purple rounded-full animate-pulse"></span>
              <span>Generating...</span>
            </>
          ) : (
            <span>+ Generate with Gemini</span>
          )}
        </button>
      </div>
      
      {highlights.length === 0 ? (
        <p className="text-gray-400 text-sm">No highlights yet. Generate one!</p>
      ) : (
        <ul className="space-y-4">
          <AnimatePresence>
            {highlights.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Render a wrapper div component inside li to avoid nested li elements */}
                <div>
                  <HighlightItem
                    item={item}
                    index={index}
                    isSelected={selectedHighlight === index}
                    onClick={() =>
                      setSelectedHighlight(index === selectedHighlight ? null : index)
                    }
                  />
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </motion.div>
  );
};

export default HighlightsList;

