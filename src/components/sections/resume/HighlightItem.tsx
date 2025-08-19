
import React from 'react';
import { motion } from 'framer-motion';
import { Award, BookOpen, Coffee } from 'lucide-react';

type HighlightItemProps = {
  item: {
    highlight: string;
    category: string;
    icon: 'award' | 'book-open' | 'coffee';
  };
  index: number;
  isSelected: boolean;
  onClick: () => void;
};

const HighlightItem = ({ item, index, isSelected, onClick }: HighlightItemProps) => {
  // Get icon component based on icon name
  const getIconComponent = (iconName: 'award' | 'book-open' | 'coffee') => {
    switch (iconName) {
      case 'award':
        return <Award className="text-neon-green" size={18} />;
      case 'book-open':
        return <BookOpen className="text-neon-green" size={18} />;
      case 'coffee':
        return <Coffee className="text-neon-green" size={18} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 * index }}
      viewport={{ once: true }}
      className={`flex items-start p-3 rounded-md transition-all cursor-pointer ${
        isSelected ? 'bg-github-border/30' : 'hover:bg-github-border/10'
      }`}
      onClick={onClick}
    >
      <div className="bg-github-dark/50 p-2 rounded-md mr-3">
        {getIconComponent(item.icon)}
      </div>
      <div>
        <div className="flex items-center">
          <span className="text-neon-green text-xs uppercase tracking-wider">{item.category}</span>
        </div>
        <span className="text-github-text block mt-1">{item.highlight}</span>

        {isSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 text-sm text-github-text/80 border-t border-github-border/30 pt-3"
          >
            <p>This highlight showcases expertise in {item.category.toLowerCase()}.
            Click to collapse this additional information.</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default HighlightItem;
