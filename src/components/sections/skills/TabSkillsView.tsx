
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import SkillCategory from './SkillCategory';
import TopSkills from './TopSkills';

type TabSkillsViewProps = {
  categories: {
    name: string;
    description: string;
    skills: {
      name: string;
      color: string;
      level: number;
    }[];
  }[];
  topSkills: { name: string; level: number }[];
  hoveredSkill: string | null;
  onSkillHover: (element: HTMLElement, skill: string, isEntering: boolean) => void;
};

const TabSkillsView = ({ 
  categories,
  topSkills,
  hoveredSkill,
  onSkillHover
}: TabSkillsViewProps) => {
  return (
    <>
      <div className="mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Tabs defaultValue={categories[0].name} className="w-full">
            <TabsList className="flex flex-wrap mb-6 bg-github-light/20">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.name}
                  value={category.name}
                  className="data-[state=active]:bg-neon-green data-[state=active]:text-black"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map((category) => (
              <TabsContent key={category.name} value={category.name}>
                <SkillCategory 
                  category={category}
                  hoveredSkill={hoveredSkill}
                  onSkillHover={onSkillHover}
                />
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
      
      <TopSkills skills={topSkills} onSkillHover={onSkillHover} />
    </>
  );
};

export default TabSkillsView;
