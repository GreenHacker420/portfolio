'use client';

export function LoadingState() {
  return (
    <section id="experience" className="py-16 sm:py-20 bg-github-dark">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-neon-green mx-auto" />
          <p className="text-white mt-4 text-sm sm:text-base">Loading experience data...</p>
        </div>
      </div>
    </section>
  );
}

export default LoadingState;
