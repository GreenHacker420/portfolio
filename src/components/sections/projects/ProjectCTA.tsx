
import { useEffect, useRef } from 'react';
import { animateIn } from '@/utils/animation-anime';

const ProjectCTA = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { animateIn('#project-cta'); }, []);
  return (
    <div id="project-cta" ref={ref} className="mt-10 text-center">
      <a
        href="#contact"
        className="inline-flex items-center px-6 py-3 bg-neon-green text-black font-medium rounded-md hover:bg-neon-green/90 transition-colors"
      >
        <span>Interested in working together?</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 ml-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </a>
    </div>
  );
};

export default ProjectCTA;
