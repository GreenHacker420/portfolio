'use client';

import { useEffect } from 'react';

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  description?: string;
  icon?: string;
  years_experience?: number;
}

interface SkillsStructuredDataProps {
  skills: Skill[];
}

const SkillsStructuredData: React.FC<SkillsStructuredDataProps> = ({ skills }) => {
  useEffect(() => {
    if (!skills || skills.length === 0) return;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://greenhacker.tech';

    // Create Person schema with skills
    const personWithSkillsSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${baseUrl}/#person`,
      name: "Harsh Hirawat",
      alternateName: "GreenHacker",
      url: baseUrl,
      jobTitle: "Full Stack Developer",
      description: "Full-stack developer specializing in modern web technologies, AI integration, and innovative solutions.",
      knowsAbout: skills.map(skill => skill.name),
      hasSkill: skills.map(skill => ({
        "@type": "DefinedTerm",
        name: skill.name,
        description: skill.description || `${skill.name} - ${skill.category}`,
        inDefinedTermSet: {
          "@type": "DefinedTermSet",
          name: skill.category,
          description: `${skill.category} technologies and tools`
        }
      })),
      expertise: skills
        .filter(skill => skill.proficiency >= 80)
        .map(skill => skill.name),
      workLocation: {
        "@type": "Place",
        name: "Remote / India"
      },
      email: "harsh@greenhacker.tech",
      sameAs: [
        "https://github.com/greenhacker",
        "https://linkedin.com/in/harsh-hirawat"
      ]
    };

    // Create skill categories as DefinedTermSet
    const skillCategories = Array.from(new Set(skills.map(skill => skill.category)));
    const skillCategorySchemas = skillCategories.map(category => {
      const categorySkills = skills.filter(skill => skill.category === category);
      
      return {
        "@context": "https://schema.org",
        "@type": "DefinedTermSet",
        "@id": `${baseUrl}/#skill-category-${category.toLowerCase().replace(/\s+/g, '-')}`,
        name: category,
        description: `${category} technologies and tools used by Harsh Hirawat`,
        hasDefinedTerm: categorySkills.map(skill => ({
          "@type": "DefinedTerm",
          name: skill.name,
          description: skill.description || `${skill.name} - Proficiency: ${skill.proficiency}%`,
          ...(skill.years_experience && {
            additionalProperty: {
              "@type": "PropertyValue",
              name: "Years of Experience",
              value: skill.years_experience
            }
          })
        })),
        inLanguage: "en-US"
      };
    });

    // Add person with skills schema
    const personScriptId = 'person-skills-schema';
    const existingPersonScript = document.getElementById(personScriptId);
    
    if (existingPersonScript) {
      existingPersonScript.remove();
    }

    const personScript = document.createElement('script');
    personScript.id = personScriptId;
    personScript.type = 'application/ld+json';
    personScript.textContent = JSON.stringify(personWithSkillsSchema);
    document.head.appendChild(personScript);

    // Add skill category schemas
    skillCategorySchemas.forEach((schema, index) => {
      const categoryScriptId = `skill-category-schema-${index}`;
      const existingCategoryScript = document.getElementById(categoryScriptId);
      
      if (existingCategoryScript) {
        existingCategoryScript.remove();
      }

      const categoryScript = document.createElement('script');
      categoryScript.id = categoryScriptId;
      categoryScript.type = 'application/ld+json';
      categoryScript.textContent = JSON.stringify(schema);
      document.head.appendChild(categoryScript);
    });

    // Create a comprehensive skills dataset
    const skillsDatasetSchema = {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "@id": `${baseUrl}/#skills-dataset`,
      name: "Harsh Hirawat's Technical Skills",
      description: "Comprehensive dataset of technical skills, proficiencies, and expertise areas",
      creator: {
        "@type": "Person",
        name: "Harsh Hirawat",
        alternateName: "GreenHacker"
      },
      dateModified: new Date().toISOString(),
      keywords: skills.map(skill => skill.name).join(', '),
      distribution: {
        "@type": "DataDownload",
        contentUrl: `${baseUrl}/#skills`,
        encodingFormat: "application/ld+json"
      },
      variableMeasured: skills.map(skill => ({
        "@type": "PropertyValue",
        name: skill.name,
        value: skill.proficiency,
        unitText: "percent",
        description: `Proficiency level in ${skill.name}`
      }))
    };

    // Add skills dataset schema
    const datasetScriptId = 'skills-dataset-schema';
    const existingDatasetScript = document.getElementById(datasetScriptId);
    
    if (existingDatasetScript) {
      existingDatasetScript.remove();
    }

    const datasetScript = document.createElement('script');
    datasetScript.id = datasetScriptId;
    datasetScript.type = 'application/ld+json';
    datasetScript.textContent = JSON.stringify(skillsDatasetSchema);
    document.head.appendChild(datasetScript);

    // Cleanup function
    return () => {
      const scriptsToRemove = [
        personScriptId,
        datasetScriptId,
        ...skillCategorySchemas.map((_, index) => `skill-category-schema-${index}`)
      ];
      
      scriptsToRemove.forEach(scriptId => {
        const script = document.getElementById(scriptId);
        if (script) {
          script.remove();
        }
      });
    };
  }, [skills]);

  return null; // This component doesn't render anything
};

export default SkillsStructuredData;
