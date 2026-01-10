
import React from 'react';

export const SafeSection = ({ children, section }) => {
    return (
        <section id={section} className="relative w-full">
            {children}
        </section>
    );
};
