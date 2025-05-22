
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Define the keyboard layout with tech stack icons
const keyboardLayout = [
  [
    { key: "JS", name: "JavaScript", color: "bg-yellow-500" },
    { key: "TS", name: "TypeScript", color: "bg-blue-500" },
    { key: "HTML", name: "HTML5", color: "bg-red-600" },
    { key: "CSS", name: "CSS3", color: "bg-blue-400" },
    { key: "GH", name: "GitHub", color: "bg-gray-700" },
    { key: "AWS", name: "AWS", color: "bg-orange-400" },
  ],
  [
    { key: "NODE", name: "Node.js", color: "bg-green-600" },
    { key: "RCT", name: "React", color: "bg-blue-300" },
    { key: "EXP", name: "Express", color: "bg-gray-600" },
    { key: "VUE", name: "Vue.js", color: "bg-green-500" },
    { key: "NEXT", name: "Next.js", color: "bg-gray-800" },
  ],
  [
    { key: "MONGO", name: "MongoDB", color: "bg-green-700" },
    { key: "PG", name: "PostgreSQL", color: "bg-blue-700" },
    { key: "FB", name: "Firebase", color: "bg-yellow-600" },
    { key: "DOCK", name: "Docker", color: "bg-blue-600" },
  ]
];

interface ToolInfo {
  name: string;
  description: string;
}

const toolDescriptions: Record<string, ToolInfo> = {
  "JavaScript": {
    name: "JavaScript",
    description: "Versatile scripting language that conforms to the ECMAScript specification."
  },
  "TypeScript": {
    name: "TypeScript",
    description: "Strongly typed programming language that builds on JavaScript."
  },
  "HTML5": {
    name: "HTML5",
    description: "Latest version of the HTML standard for structuring web content."
  },
  "CSS3": {
    name: "CSS3",
    description: "Latest CSS standard for styling and layout."
  },
  "GitHub": {
    name: "GitHub",
    description: "Platform for version control and collaboration using Git."
  },
  "AWS": {
    name: "AWS",
    description: "Amazon Web Services - cloud computing services."
  },
  "Node.js": {
    name: "Node.js",
    description: "JavaScript runtime built on Chrome's V8 JavaScript engine."
  },
  "React": {
    name: "React",
    description: "JavaScript library for building user interfaces."
  },
  "Express": {
    name: "Express",
    description: "Fast, unopinionated, minimalist web framework for Node.js."
  },
  "Vue.js": {
    name: "Vue.js",
    description: "Progressive framework for building user interfaces."
  },
  "Next.js": {
    name: "Next.js",
    description: "React framework for production-grade applications."
  },
  "MongoDB": {
    name: "MongoDB",
    description: "NoSQL document database with scalability and flexibility."
  },
  "PostgreSQL": {
    name: "PostgreSQL",
    description: "Powerful, open source object-relational database system."
  },
  "Firebase": {
    name: "Firebase",
    description: "Google's platform for mobile and web application development."
  },
  "Docker": {
    name: "Docker",
    description: "Platform for developing, shipping, and running applications in containers."
  }
};

const KeyboardSkills = () => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [lastPressed, setLastPressed] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle physical keyboard press
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      
      // Find if any of our keys match
      let found = false;
      keyboardLayout.forEach(row => {
        row.forEach(item => {
          if (item.key.startsWith(key)) {
            setSelectedKey(item.name);
            setLastPressed(Date.now());
            found = true;
          }
        });
      });
      
      if (!found) {
        // If we're pressing a key that's not in our layout, show a random one for fun
        const randomRow = Math.floor(Math.random() * keyboardLayout.length);
        const randomKey = Math.floor(Math.random() * keyboardLayout[randomRow].length);
        setSelectedKey(keyboardLayout[randomRow][randomKey].name);
        setLastPressed(Date.now());
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);
  
  // Clear selected key after 2 seconds
  useEffect(() => {
    if (selectedKey) {
      const timer = setTimeout(() => {
        setSelectedKey(null);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [selectedKey, lastPressed]);
  
  // Get info about selected tool
  const selectedTool = selectedKey ? toolDescriptions[selectedKey] : null;
  
  return (
    <div className="flex flex-col items-center justify-center relative" ref={containerRef}>
      {/* 3D keyboard layout background with perspective */}
      <motion.div
        initial={{ rotateX: 60, y: 50, opacity: 0 }}
        animate={{ rotateX: 55, y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ 
          perspective: "1000px",
          transformStyle: "preserve-3d"
        }}
        className="mb-12 relative"
      >
        {/* Left text overlay */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute left-0 top-[20%] -translate-y-1/2 -translate-x-full pr-8 text-right"
          style={{ transform: "rotateZ(-25deg)" }}
        >
          <h3 className="text-5xl sm:text-7xl font-bold text-white/10">JavaScript</h3>
          <div className="text-left">
            <p className="text-xl text-white/30">writing code into the DOM</p>
            <p className="text-xl text-white/30">since '95, no cap!</p>
          </div>
        </motion.div>
        
        {/* Keyboard grid */}
        <div className="grid gap-3 p-6 bg-black/50 rounded-lg border border-gray-700 shadow-2xl transform">
          {keyboardLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-3 justify-center">
              {row.map((key) => (
                <motion.div
                  key={key.key}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: rowIndex * 0.1 + Math.random() * 0.2 }}
                  whileHover={{ y: -10, scale: 1.1 }}
                  whileTap={{ y: 0, scale: 0.95 }}
                  onClick={() => {
                    setSelectedKey(key.name);
                    setLastPressed(Date.now());
                  }}
                  className={`${key.color} w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center cursor-pointer shadow-lg ${selectedKey === key.name ? 'ring-4 ring-white' : ''}`}
                >
                  <span className="text-white font-bold text-sm sm:text-lg">{key.key}</span>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Info panel */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedTool ? 1 : 0, y: selectedTool ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="bg-github-light/30 backdrop-blur-sm p-6 rounded-lg border border-github-border max-w-xl w-full min-h-[120px] flex items-center justify-center"
      >
        {selectedTool ? (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-neon-green mb-2">{selectedTool.name}</h3>
            <p className="text-github-text">{selectedTool.description}</p>
          </div>
        ) : (
          <p className="text-github-text/50 text-center">Press a key or click on a technology to see more information</p>
        )}
      </motion.div>
    </div>
  );
};

export default KeyboardSkills;
