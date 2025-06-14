'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SectionSEOProps {
  section?: string;
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
}

const SectionSEO: React.FC<SectionSEOProps> = ({
  section,
  title,
  description,
  keywords = [],
  image
}) => {
  const router = useRouter();

  useEffect(() => {
    if (!section) return;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://greenhacker.tech';
    
    // Section-specific SEO data
    const sectionData = {
      about: {
        title: 'About Harsh Hirawat (GreenHacker) - Full Stack Developer',
        description: 'Learn about Harsh Hirawat (GreenHacker), a passionate full-stack developer with expertise in React, Next.js, TypeScript, Python, and AI integration. Discover his journey, skills, and approach to modern web development.',
        keywords: ['about harsh hirawat', 'greenhacker bio', 'full stack developer background', 'web developer story', 'react developer experience']
      },
      skills: {
        title: 'Technical Skills - Harsh Hirawat Portfolio',
        description: 'Explore Harsh Hirawat\'s comprehensive technical skills including React, Next.js, TypeScript, Python, AI/ML, databases, cloud services, and modern web development technologies with proficiency levels.',
        keywords: ['harsh hirawat skills', 'react developer skills', 'full stack technologies', 'javascript typescript python', 'ai ml developer skills']
      },
      projects: {
        title: 'Projects Portfolio - Harsh Hirawat (GreenHacker)',
        description: 'Browse Harsh Hirawat\'s portfolio of innovative web development projects featuring React, Next.js, AI integration, 3D graphics, and modern web applications with live demos and source code.',
        keywords: ['harsh hirawat projects', 'react projects portfolio', 'full stack projects', 'ai integration projects', 'web development portfolio']
      },
      experience: {
        title: 'Professional Experience - Harsh Hirawat',
        description: 'Discover Harsh Hirawat\'s professional experience in full-stack development, including work history, achievements, and contributions to various projects and organizations.',
        keywords: ['harsh hirawat experience', 'full stack developer experience', 'professional background', 'work history', 'career achievements']
      },
      resume: {
        title: 'Resume - Harsh Hirawat (GreenHacker) Full Stack Developer',
        description: 'Download or view Harsh Hirawat\'s professional resume showcasing his full-stack development skills, experience, education, and achievements in modern web technologies.',
        keywords: ['harsh hirawat resume', 'full stack developer cv', 'download resume', 'professional resume', 'developer cv pdf']
      },
      contact: {
        title: 'Contact Harsh Hirawat - Full Stack Developer for Hire',
        description: 'Get in touch with Harsh Hirawat (GreenHacker) for full-stack development projects, consulting, or collaboration opportunities. Available for freelance and full-time positions.',
        keywords: ['contact harsh hirawat', 'hire full stack developer', 'freelance developer', 'web development services', 'project collaboration']
      }
    };

    const currentSection = sectionData[section as keyof typeof sectionData];
    if (!currentSection) return;

    // Update document title
    const sectionTitle = title || currentSection.title;
    document.title = sectionTitle;

    // Update meta description
    const sectionDescription = description || currentSection.description;
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', sectionDescription);

    // Update meta keywords
    const sectionKeywords = keywords.length > 0 ? keywords : currentSection.keywords;
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', sectionKeywords.join(', '));

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', sectionTitle);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', sectionDescription);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', `${baseUrl}/#${section}`);
    }

    // Update Twitter Card tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', sectionTitle);
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', sectionDescription);
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${baseUrl}/#${section}`);

    // Add section-specific structured data
    const sectionSchema = {
      "@context": "https://schema.org",
      "@type": "WebPageElement",
      "@id": `${baseUrl}/#${section}`,
      name: sectionTitle,
      description: sectionDescription,
      url: `${baseUrl}/#${section}`,
      isPartOf: {
        "@type": "WebPage",
        "@id": baseUrl,
        name: "Harsh Hirawat Portfolio",
        url: baseUrl
      },
      author: {
        "@type": "Person",
        name: "Harsh Hirawat",
        alternateName: "GreenHacker"
      },
      inLanguage: "en-US",
      keywords: sectionKeywords.join(', ')
    };

    // Add section schema
    const sectionScriptId = `section-${section}-schema`;
    const existingSectionScript = document.getElementById(sectionScriptId);
    
    if (existingSectionScript) {
      existingSectionScript.remove();
    }

    const sectionScript = document.createElement('script');
    sectionScript.id = sectionScriptId;
    sectionScript.type = 'application/ld+json';
    sectionScript.textContent = JSON.stringify(sectionSchema);
    document.head.appendChild(sectionScript);

    // Cleanup function
    return () => {
      const script = document.getElementById(sectionScriptId);
      if (script) {
        script.remove();
      }
    };
  }, [section, title, description, keywords, image]);

  return null; // This component doesn't render anything
};

export default SectionSEO;
