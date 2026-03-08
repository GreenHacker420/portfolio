import * as React from "react";

export const TerminalCard = ({ children, className = "" }) => {
    return (
        <div className={`border border-white/10 bg-surface-light rounded-xl p-8 text-left relative overflow-hidden shadow-2xl z-10 ${className}`}>
            {/* Top inner glow line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
            {/* Bottom inner glow line */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-brand/20 via-blue-500/20 to-brand/20" />

            {children}
        </div>
    );
};
