import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skill } from '../../../data/skillsData';
import styled from 'styled-components';

interface SkillInfoProps {
  skill: Skill | null;
  isVisible: boolean;
}

const SkillInfo: React.FC<SkillInfoProps> = ({ skill, isVisible }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to top when a new skill is selected
  useEffect(() => {
    if (isVisible && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [skill, isVisible]);

  if (!skill) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <Container
          ref={containerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <Header style={{ backgroundColor: skill.color }}>
            <HeaderContent>
              <Logo>
                <img 
                  src={`/icons/${skill.logo}.svg`} 
                  alt={skill.name} 
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).src = '/icons/default.svg';
                  }}
                />
              </Logo>
              <HeaderText>
                <h2>{skill.name}</h2>
                <p>{skill.description}</p>
              </HeaderText>
            </HeaderContent>
          </Header>

          <Content>
            <Section>
              <h3>Experience</h3>
              <ExperienceBar>
                <ExperienceFill style={{ width: `${skill.proficiency}%`, backgroundColor: skill.color }} />
                <ExperienceLabel>{skill.experience} years ({skill.proficiency}%)</ExperienceLabel>
              </ExperienceBar>
            </Section>

            <Section>
              <h3>Notable Projects</h3>
              <List>
                {skill.projects.map((project, index) => (
                  <ListItem key={index}>{project}</ListItem>
                ))}
              </List>
            </Section>

            <Section>
              <h3>Key Strengths</h3>
              <StrengthTags>
                {skill.strengths.map((strength, index) => (
                  <StrengthTag key={index} style={{ backgroundColor: `${skill.color}33`, color: skill.color }}>
                    {strength}
                  </StrengthTag>
                ))}
              </StrengthTags>
            </Section>
          </Content>
        </Container>
      )}
    </AnimatePresence>
  );
};

// Styled components
const Container = styled(motion.div)`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 350px;
  max-height: 80vh;
  background-color: rgba(15, 15, 15, 0.9);
  border-radius: 12px;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  z-index: 100;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`;

const Header = styled.div`
  padding: 20px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  transition: background-color 0.3s ease;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.div`
  width: 60px;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;

  img {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }
`;

const HeaderText = styled.div`
  color: white;

  h2 {
    margin: 0 0 5px 0;
    font-size: 24px;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
  }
`;

const Content = styled.div`
  padding: 20px;
`;

const Section = styled.div`
  margin-bottom: 25px;

  h3 {
    margin: 0 0 10px 0;
    font-size: 18px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
  }
`;

const ExperienceBar = styled.div`
  height: 12px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  position: relative;
  margin-bottom: 25px;
  overflow: hidden;
`;

const ExperienceFill = styled.div`
  height: 100%;
  border-radius: 6px;
  transition: width 1s ease-out;
`;

const ExperienceLabel = styled.div`
  position: absolute;
  top: 20px;
  right: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
`;

const List = styled.ul`
  margin: 0;
  padding: 0 0 0 20px;
  list-style-type: disc;
`;

const ListItem = styled.li`
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
  font-size: 15px;
`;

const StrengthTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const StrengthTag = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
`;

export default SkillInfo;
