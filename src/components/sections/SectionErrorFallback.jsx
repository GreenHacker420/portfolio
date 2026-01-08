import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function SectionErrorFallback({ section }) {
    return (
        <div className="w-full h-64 flex flex-col items-center justify-center p-8 text-neutral-400 bg-neutral-900/50 rounded-lg border border-neutral-800">
            <AlertTriangle className="w-8 h-8 mb-4 text-yellow-500" />
            <h3 className="text-lg font-semibold mb-2">Could not load {section}</h3>
            <p className="text-sm text-center max-w-md">
                We encountered an error while loading this section. Please try refreshing the page.
            </p>
        </div>
    );
}
