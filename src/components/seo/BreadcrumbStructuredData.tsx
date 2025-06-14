'use client';

import { useEffect } from 'react';

interface BreadcrumbItem {
  name: string;
  url: string;
  position: number;
}

interface BreadcrumbStructuredDataProps {
  items?: BreadcrumbItem[];
  currentSection?: string;
}

const BreadcrumbStructuredData: React.FC<BreadcrumbStructuredDataProps> = ({ 
  items, 
  currentSection 
}) => {
  useEffect(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://greenhacker.tech';
    
    // Default breadcrumb items for the portfolio
    const defaultItems: BreadcrumbItem[] = [
      {
        name: "Home",
        url: baseUrl,
        position: 1
      },
      {
        name: "About",
        url: `${baseUrl}/#about`,
        position: 2
      },
      {
        name: "Skills",
        url: `${baseUrl}/#skills`,
        position: 3
      },
      {
        name: "Projects",
        url: `${baseUrl}/#projects`,
        position: 4
      },
      {
        name: "Experience",
        url: `${baseUrl}/#experience`,
        position: 5
      },
      {
        name: "Resume",
        url: `${baseUrl}/#resume`,
        position: 6
      },
      {
        name: "Contact",
        url: `${baseUrl}/#contact`,
        position: 7
      }
    ];

    // Use provided items or default items
    const breadcrumbItems = items || defaultItems;

    // If currentSection is provided, filter to show path to that section
    let filteredItems = breadcrumbItems;
    if (currentSection) {
      const sectionIndex = breadcrumbItems.findIndex(
        item => item.name.toLowerCase() === currentSection.toLowerCase()
      );
      if (sectionIndex !== -1) {
        filteredItems = breadcrumbItems.slice(0, sectionIndex + 1);
      }
    }

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${baseUrl}/#breadcrumb`,
      name: "Portfolio Navigation",
      description: "Navigation breadcrumb for Harsh Hirawat's portfolio sections",
      itemListElement: filteredItems.map(item => ({
        "@type": "ListItem",
        position: item.position,
        name: item.name,
        item: {
          "@type": "WebPage",
          "@id": item.url,
          name: item.name,
          url: item.url,
          isPartOf: {
            "@type": "WebSite",
            name: "Harsh Hirawat Portfolio",
            url: baseUrl
          }
        }
      })),
      numberOfItems: filteredItems.length,
      inLanguage: "en-US"
    };

    // Add breadcrumb structured data
    const breadcrumbScriptId = 'breadcrumb-schema';
    const existingBreadcrumbScript = document.getElementById(breadcrumbScriptId);
    
    if (existingBreadcrumbScript) {
      existingBreadcrumbScript.remove();
    }

    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.id = breadcrumbScriptId;
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(breadcrumbScript);

    // Also create a SiteNavigationElement schema for better understanding
    const navigationSchema = {
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      "@id": `${baseUrl}/#navigation`,
      name: "Portfolio Navigation",
      description: "Main navigation elements for Harsh Hirawat's portfolio website",
      hasPart: filteredItems.map(item => ({
        "@type": "WebPageElement",
        name: item.name,
        url: item.url,
        description: `${item.name} section of Harsh Hirawat's portfolio`
      })),
      isPartOf: {
        "@type": "WebSite",
        name: "Harsh Hirawat Portfolio",
        url: baseUrl
      }
    };

    // Add navigation structured data
    const navigationScriptId = 'navigation-schema';
    const existingNavigationScript = document.getElementById(navigationScriptId);
    
    if (existingNavigationScript) {
      existingNavigationScript.remove();
    }

    const navigationScript = document.createElement('script');
    navigationScript.id = navigationScriptId;
    navigationScript.type = 'application/ld+json';
    navigationScript.textContent = JSON.stringify(navigationSchema);
    document.head.appendChild(navigationScript);

    // Cleanup function
    return () => {
      const scriptsToRemove = [breadcrumbScriptId, navigationScriptId];
      scriptsToRemove.forEach(scriptId => {
        const script = document.getElementById(scriptId);
        if (script) {
          script.remove();
        }
      });
    };
  }, [items, currentSection]);

  return null; // This component doesn't render anything
};

export default BreadcrumbStructuredData;
