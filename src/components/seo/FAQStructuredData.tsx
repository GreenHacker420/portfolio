'use client';

import { useEffect } from 'react';

const FAQStructuredData = () => {
  useEffect(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://greenhacker.tech';

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${baseUrl}/#faq`,
      name: "Frequently Asked Questions - Harsh Hirawat Portfolio",
      description: "Common questions about Harsh Hirawat's development services, skills, and portfolio",
      mainEntity: [
        {
          "@type": "Question",
          name: "Who is Harsh Hirawat (GreenHacker)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Harsh Hirawat, also known as GreenHacker, is a full-stack developer specializing in modern web technologies, AI integration, and innovative solutions. He has expertise in React, Next.js, TypeScript, Python, and machine learning technologies."
          }
        },
        {
          "@type": "Question",
          name: "What services does Harsh Hirawat offer?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Harsh offers full-stack web development services including frontend development with React/Next.js, backend development with Node.js/Python, AI integration, machine learning solutions, and modern web application development with responsive design and performance optimization."
          }
        },
        {
          "@type": "Question",
          name: "What technologies does Harsh Hirawat specialize in?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Harsh specializes in React, Next.js, TypeScript, JavaScript, Python, Node.js, Three.js, GSAP, Tailwind CSS, machine learning, AI integration, and modern web development frameworks. He also has experience with databases, cloud services, and DevOps practices."
          }
        },
        {
          "@type": "Question",
          name: "How can I contact Harsh Hirawat for project inquiries?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can contact Harsh Hirawat through email at harsh@greenhacker.tech or through the contact form on his portfolio website at greenhacker.tech. He is available for freelance projects, consulting, and full-time opportunities."
          }
        },
        {
          "@type": "Question",
          name: "Does Harsh Hirawat work on AI and machine learning projects?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, Harsh has extensive experience in AI and machine learning projects. He specializes in integrating AI solutions into web applications, building ML models, and creating intelligent user experiences using modern AI technologies."
          }
        },
        {
          "@type": "Question",
          name: "What makes Harsh Hirawat's portfolio unique?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Harsh's portfolio features interactive 3D elements, AI-powered chatbot, real-time GitHub statistics, modern animations with GSAP, responsive design, and showcases a diverse range of projects from web applications to AI integrations, demonstrating both technical skills and creative problem-solving."
          }
        },
        {
          "@type": "Question",
          name: "Is Harsh Hirawat available for remote work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, Harsh Hirawat is available for remote work and has experience working with distributed teams. He is comfortable with various collaboration tools and can adapt to different time zones for project requirements."
          }
        },
        {
          "@type": "Question",
          name: "What is GreenHacker's experience with open source?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Harsh Hirawat (GreenHacker) is an active open source contributor with multiple projects on GitHub. He believes in contributing back to the developer community and regularly shares code, tools, and knowledge through open source projects."
          }
        },
        {
          "@type": "Question",
          name: "Can I see examples of Harsh Hirawat's work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, you can view Harsh's portfolio projects on his website at greenhacker.tech, check his GitHub profile for code examples, and see live demos of his applications. His portfolio showcases various projects including web applications, AI integrations, and innovative solutions."
          }
        },
        {
          "@type": "Question",
          name: "What is Harsh Hirawat's approach to web development?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Harsh follows modern web development best practices including responsive design, performance optimization, accessibility compliance, SEO optimization, clean code architecture, and user-centered design. He focuses on creating scalable, maintainable, and high-performance applications."
          }
        }
      ],
      inLanguage: "en-US",
      dateModified: new Date().toISOString(),
      author: {
        "@type": "Person",
        name: "Harsh Hirawat",
        alternateName: "GreenHacker",
        url: baseUrl
      }
    };

    // Add FAQ structured data
    const faqScriptId = 'faq-schema';
    const existingFaqScript = document.getElementById(faqScriptId);
    
    if (existingFaqScript) {
      existingFaqScript.remove();
    }

    const faqScript = document.createElement('script');
    faqScript.id = faqScriptId;
    faqScript.type = 'application/ld+json';
    faqScript.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(faqScript);

    // Cleanup function
    return () => {
      const script = document.getElementById(faqScriptId);
      if (script) {
        script.remove();
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default FAQStructuredData;
