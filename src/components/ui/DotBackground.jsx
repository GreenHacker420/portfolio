
'use client';
import React from "react";

export function DotBackground({ children, className }) {
    // SVG for the dot pattern
    const dotSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="2" cy="2" r="1.5" fill="#333333" fill-opacity="0.4" />
    </svg>
  `;

    // Encode SVG for usage in background-image
    const encodedDotSvg = `data:image/svg+xml;utf8,${encodeURIComponent(dotSvg)}`;

    return (
        <div className={`relative min-h-screen w-full bg-black ${className}`}>
            {/* Background Pattern */}
            <div
                className="absolute pointer-events-none inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_90%)]"
                style={{
                    backgroundImage: `url('${encodedDotSvg}')`,
                    backgroundSize: '24px 24px', // Adjust spacing of dots
                    backgroundRepeat: 'repeat',
                }}
            ></div>

            {/* Radial Gradient Glow for the container to give a faded look */}
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

            {/* Content */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
}

export function GridBackground({ children, className }) {
    // Alternative Grid style
    const gridSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#222" stroke-width="1">
       <path d="M0 .5H40V40" />
    </svg>
    `;
    const encodedGrid = `data:image/svg+xml;utf8,${encodeURIComponent(gridSvg)}`;

    return (
        <div className={`relative min-h-screen w-full bg-black ${className}`}>
            <div
                className="absolute pointer-events-none inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
                style={{
                    backgroundImage: `url('${encodedGrid}')`,
                    backgroundSize: '40px 40px',
                }}
            ></div>
            <div className="relative z-10">{children}</div>
        </div>
    );
}
