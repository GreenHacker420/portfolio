'use client';

export default function SectionErrorFallback({ section }: { section: string }) {
  return (
    <div className="py-20 bg-github-dark">
      <div className="section-container">
        <h2 className="section-title text-white">{section}</h2>
        <div className="p-6 bg-github-light rounded-lg border border-github-border">
          <div className="text-center">
            <p className="text-white mb-4">This section could not be loaded.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-neon-green text-black rounded-md hover:bg-neon-green/90 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

