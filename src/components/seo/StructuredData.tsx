'use client';

import { useEffect } from 'react';

interface PersonSchema {
  "@context": "https://schema.org";
  "@type": "Person";
  name: string;
  alternateName?: string;
  jobTitle: string;
  description: string;
  url: string;
  email?: string;
  sameAs: string[];
  knowsAbout: string[];
  alumniOf?: {
    "@type": "EducationalOrganization";
    name: string;
  };
  worksFor?: {
    "@type": "Organization";
    name: string;
  };
  hasOccupation?: {
    "@type": "Occupation";
    name: string;
    description: string;
    skills: string;
  };
  workLocation?: {
    "@type": "Place";
    name: string;
  };
}

interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  alternateName?: string;
  description: string;
  url: string;
  author: {
    "@type": "Person";
    name: string;
    alternateName?: string;
  };
  potentialAction: {
    "@type": "SearchAction";
    target: {
      "@type": "EntryPoint";
      urlTemplate: string;
    };
    "query-input": string;
  };
}

interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  alternateName?: string;
  description: string;
  url: string;
  logo: string;
  founder: {
    "@type": "Person";
    name: string;
    alternateName?: string;
  };
  contactPoint: {
    "@type": "ContactPoint";
    email: string;
    contactType: string;
    availableLanguage?: string[];
  };
}

const StructuredData = () => {
  useEffect(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://greenhacker.tech';

    // Person Schema
    const personSchema: PersonSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Harsh Hirawat",
      alternateName: "GreenHacker",
      jobTitle: "Full-Stack Developer & AI Specialist",
      description: "Harsh Hirawat (GreenHacker) is an experienced full-stack developer specializing in modern web technologies, AI integration, and innovative software solutions. Proficient in React, Next.js, TypeScript, Python, and machine learning.",
      url: baseUrl,
      email: "harsh@greenhacker.tech",
      sameAs: [
        "https://github.com/GreenHacker420",
        "https://linkedin.com/in/harsh-hirawat-b657061b7",
        "https://codeforces.com/profile/GreenHacker",
        "https://leetcode.com/u/greenhacker420/"
      ],
      knowsAbout: [
        "JavaScript",
        "TypeScript",
        "React",
        "Next.js",
        "Python",
        "Machine Learning",
        "Artificial Intelligence",
        "Full-Stack Development",
        "Web Development",
        "Software Engineering",
        "Node.js",
        "Three.js",
        "GSAP",
        "Tailwind CSS"
      ],
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "Computer Science Education"
      },
      hasOccupation: {
        "@type": "Occupation",
        name: "Full Stack Developer",
        description: "Develops both frontend and backend components of web applications with expertise in AI integration",
        skills: "JavaScript, TypeScript, React, Next.js, Python, AI/ML, Database Design, Cloud Services"
      },
      workLocation: {
        "@type": "Place",
        name: "Remote / India"
      }
    };

    // Website Schema
    const websiteSchema: WebSiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Harsh Hirawat Portfolio",
      alternateName: "GreenHacker Portfolio",
      description: "Professional portfolio showcasing full-stack development projects, AI integrations, and modern web technologies by Harsh Hirawat (GreenHacker).",
      url: baseUrl,
      author: {
        "@type": "Person",
        name: "Harsh Hirawat",
        alternateName: "GreenHacker"
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${baseUrl}/?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    };

    // Organization Schema
    const organizationSchema: OrganizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "GreenHacker Development",
      alternateName: "Harsh Hirawat Development Services",
      description: "Professional software development services specializing in full-stack web applications and AI-powered solutions by Harsh Hirawat (GreenHacker).",
      url: baseUrl,
      logo: `${baseUrl}/logo.jpg`,
      founder: {
        "@type": "Person",
        name: "Harsh Hirawat",
        alternateName: "GreenHacker"
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: "harsh@greenhacker.tech",
        contactType: "Professional Inquiries",
        availableLanguage: ["English", "Hindi"]
      }
    };

    // Function to add or update structured data
    const addStructuredData = (id: string, schema: any) => {
      // Remove existing script if it exists
      const existingScript = document.getElementById(id);
      if (existingScript) {
        existingScript.remove();
      }

      // Add new script
      const script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    };

    // Add all structured data
    addStructuredData('person-schema', personSchema);
    addStructuredData('website-schema', websiteSchema);
    addStructuredData('organization-schema', organizationSchema);

    // Cleanup function
    return () => {
      ['person-schema', 'website-schema', 'organization-schema'].forEach(id => {
        const script = document.getElementById(id);
        if (script) {
          script.remove();
        }
      });
    };
  }, []);

  return null; // This component doesn't render anything
};

export default StructuredData;
