'use client';

import { useEffect } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: string;
  technologies?: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
  start_date?: string;
  end_date?: string;
  highlights?: string[];
}

interface ProjectStructuredDataProps {
  projects: Project[];
}

const ProjectStructuredData: React.FC<ProjectStructuredDataProps> = ({ projects }) => {
  useEffect(() => {
    if (!projects || projects.length === 0) return;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://greenhacker.tech';

    // Create structured data for each project
    projects.forEach((project, index) => {
      const projectSchema = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "@id": `${baseUrl}/#project-${project.id}`,
        name: project.title,
        description: project.description,
        creator: {
          "@type": "Person",
          name: "Harsh Hirawat",
          alternateName: "GreenHacker",
          url: baseUrl
        },
        dateCreated: project.start_date || new Date().toISOString(),
        dateModified: project.end_date || new Date().toISOString(),
        genre: project.category,
        keywords: project.technologies?.join(', ') || '',
        url: project.live_url || project.github_url || `${baseUrl}/#projects`,
        image: project.image_url ? `${baseUrl}${project.image_url}` : `${baseUrl}/logo.jpg`,
        ...(project.github_url && {
          codeRepository: project.github_url
        }),
        ...(project.live_url && {
          workExample: {
            "@type": "WebSite",
            url: project.live_url,
            name: `${project.title} - Live Demo`
          }
        }),
        ...(project.highlights && project.highlights.length > 0 && {
          abstract: project.highlights.join('. ')
        }),
        inLanguage: "en-US",
        isAccessibleForFree: true,
        license: "https://opensource.org/licenses/MIT"
      };

      // Add or update structured data
      const scriptId = `project-schema-${project.id}`;
      const existingScript = document.getElementById(scriptId);
      
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(projectSchema);
      document.head.appendChild(script);
    });

    // Create a portfolio collection schema
    const portfolioSchema = {
      "@context": "https://schema.org",
      "@type": "Collection",
      "@id": `${baseUrl}/#portfolio`,
      name: "Harsh Hirawat's Development Portfolio",
      description: "A collection of full-stack development projects showcasing modern web technologies, AI integration, and innovative solutions.",
      creator: {
        "@type": "Person",
        name: "Harsh Hirawat",
        alternateName: "GreenHacker",
        url: baseUrl
      },
      url: `${baseUrl}/#projects`,
      numberOfItems: projects.length,
      hasPart: projects.map(project => ({
        "@type": "CreativeWork",
        "@id": `${baseUrl}/#project-${project.id}`,
        name: project.title,
        url: project.live_url || project.github_url || `${baseUrl}/#projects`
      })),
      inLanguage: "en-US",
      dateModified: new Date().toISOString()
    };

    // Add portfolio collection schema
    const portfolioScriptId = 'portfolio-collection-schema';
    const existingPortfolioScript = document.getElementById(portfolioScriptId);
    
    if (existingPortfolioScript) {
      existingPortfolioScript.remove();
    }

    const portfolioScript = document.createElement('script');
    portfolioScript.id = portfolioScriptId;
    portfolioScript.type = 'application/ld+json';
    portfolioScript.textContent = JSON.stringify(portfolioSchema);
    document.head.appendChild(portfolioScript);

    // Cleanup function
    return () => {
      projects.forEach(project => {
        const script = document.getElementById(`project-schema-${project.id}`);
        if (script) {
          script.remove();
        }
      });
      
      const portfolioScript = document.getElementById(portfolioScriptId);
      if (portfolioScript) {
        portfolioScript.remove();
      }
    };
  }, [projects]);

  return null; // This component doesn't render anything
};

export default ProjectStructuredData;
