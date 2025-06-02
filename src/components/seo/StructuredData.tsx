'use client';

import { useEffect } from 'react';

interface PersonSchema {
  "@context": "https://schema.org";
  "@type": "Person";
  name: string;
  jobTitle: string;
  description: string;
  url: string;
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
}

interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  description: string;
  url: string;
  author: {
    "@type": "Person";
    name: string;
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
  description: string;
  url: string;
  logo: string;
  founder: {
    "@type": "Person";
    name: string;
  };
  contactPoint: {
    "@type": "ContactPoint";
    email: string;
    contactType: string;
  };
}

const StructuredData = () => {
  useEffect(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://greenhacker.dev';

    // Person Schema
    const personSchema: PersonSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "GreenHacker",
      jobTitle: "Full-Stack Developer & AI Specialist",
      description: "Experienced full-stack developer specializing in modern web technologies, AI integration, and innovative software solutions. Proficient in React, Next.js, TypeScript, Python, and machine learning.",
      url: baseUrl,
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
      }
    };

    // Website Schema
    const websiteSchema: WebSiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "GreenHacker Portfolio",
      description: "Professional portfolio showcasing full-stack development projects, AI integrations, and modern web technologies.",
      url: baseUrl,
      author: {
        "@type": "Person",
        name: "GreenHacker"
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
      description: "Professional software development services specializing in full-stack web applications and AI-powered solutions.",
      url: baseUrl,
      logo: `${baseUrl}/logo.jpg`,
      founder: {
        "@type": "Person",
        name: "GreenHacker"
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: "harsh@greenhacker.tech",
        contactType: "Professional Inquiries"
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
