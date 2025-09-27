'use client';

import { useEffect } from 'react';

// Project interface matching exact Prisma schema (API serialized format)
interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: string;
  technologies?: string; // JSON string from Prisma
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  gallery?: string; // JSON string from Prisma
  highlights?: string; // JSON string from Prisma
  challenges?: string; // JSON string from Prisma
  learnings?: string; // JSON string from Prisma
  startDate?: string | Date; // Can be string from API or Date
  endDate?: string | Date; // Can be string from API or Date
  teamSize?: number;
  role?: string;
  isVisible: boolean;
  displayOrder: number;
  viewCount: number;
  createdAt: string | Date; // Can be string from API or Date
  updatedAt: string | Date; // Can be string from API or Date
}

interface ProjectStructuredDataProps {
  projects: Project[];
}

const ProjectStructuredData: React.FC<ProjectStructuredDataProps> = ({ projects }) => {
  // Helper function to safely convert date to ISO string
  const toISOString = (date: string | Date | undefined | null): string => {
    if (!date) return new Date().toISOString();
    
    if (typeof date === 'string') {
      const parsedDate = new Date(date);
      return isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();
    }
    
    if (date instanceof Date) {
      return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
    }
    
    return new Date().toISOString();
  };

  useEffect(() => {
    if (!projects || projects.length === 0) return;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://greenhacker.tech';

    // Create structured data for each project
    projects.forEach((project, index) => {
      // Skip projects with missing required fields
      if (!project.id || !project.title || !project.description) {
        console.warn('Skipping project with missing required fields:', project);
        return;
      }
      // Parse JSON fields with error handling
      let technologies: string[] = [];
      let highlights: string[] = [];
      
      // Safe JSON parsing helper
      const safeJsonParse = (jsonString: string | undefined | null, fallback: any[] = []): any[] => {
        if (!jsonString || typeof jsonString !== 'string') return fallback;
        try {
          const parsed = JSON.parse(jsonString);
          return Array.isArray(parsed) ? parsed : fallback;
        } catch (error) {
          console.warn('Failed to parse JSON:', jsonString, error);
          return fallback;
        }
      };
      
      technologies = safeJsonParse(project.technologies);
      highlights = safeJsonParse(project.highlights);
      
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
        dateCreated: toISOString(project.startDate),
        dateModified: toISOString(project.endDate || project.updatedAt),
        genre: project.category,
        keywords: technologies.join(', ') || '',
        url: project.liveUrl || project.githubUrl || `${baseUrl}/#projects`,
        image: project.imageUrl 
          ? (project.imageUrl.startsWith('http') ? project.imageUrl : `${baseUrl}${project.imageUrl.startsWith('/') ? '' : '/'}${project.imageUrl}`)
          : `${baseUrl}/logo.jpg`,
        ...(project.githubUrl && {
          codeRepository: project.githubUrl
        }),
        ...(project.liveUrl && {
          workExample: {
            "@type": "WebSite",
            url: project.liveUrl,
            name: `${project.title} - Live Demo`
          }
        }),
        ...(highlights.length > 0 && {
          abstract: highlights.join('. ')
        }),
        ...(project.role && {
          contributor: {
            "@type": "Person",
            name: "Harsh Hirawat",
            jobTitle: project.role
          }
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
        url: project.liveUrl || project.githubUrl || `${baseUrl}/#projects`
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
