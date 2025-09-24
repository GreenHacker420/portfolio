
'use client';

import React from 'react';

import ResumePreview from './resume/ResumePreview';
import HighlightsList from './resume/HighlightsList';
import ResumeIntro from './resume/ResumeIntro';
import ResumeAIInsights from './resume/ResumeAIInsights';
import CVDemo from './resume/CVDemo';
import RobotControl from './resume/RobotControl';

const Resume = () => {
  return (
    <section id="resume" className="py-20 bg-github-dark relative">
      <div className="section-container space-y-10">
        <h2 className="section-title">Resume</h2>

        <ResumePreview />
        <ResumeIntro />
        <ResumeAIInsights />
        <CVDemo />
        <RobotControl />
        
        {/* <HighlightsList /> */}
      </div>
    </section>
  );
};

export default Resume;
