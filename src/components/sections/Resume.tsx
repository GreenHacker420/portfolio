
import React from 'react';
import { motion } from 'framer-motion';
import ResumePreview from './resume/ResumePreview';
import HighlightsList from './resume/HighlightsList';

const Resume = () => {
  return (
    <section id="resume" className="py-20 bg-github-dark relative">
      <div className="section-container">
        <h2 className="section-title mb-12">Resume</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ResumePreview />
          <HighlightsList />
        </div>
      </div>
    </section>
  );
};

export default Resume;
