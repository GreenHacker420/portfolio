
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/common/ErrorBoundary";
import LoadingScreen from "./components/sections/LoadingScreen";

// Simple error boundary fallback component
const ErrorFallback = () => {
  return (
    <div className="min-h-screen bg-github-dark text-github-text flex items-center justify-center">
      <div className="max-w-md p-6 bg-github-light rounded-lg">
        <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
        <p className="mb-4">We're sorry, but something went wrong with the rendering of this page.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-neon-green text-black rounded-md hover:bg-neon-green/90"
        >
          Reload page
        </button>
      </div>
    </div>
  );
};

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has already seen the loading screen
    const hasLoadingBeenShown = sessionStorage.getItem('loadingShown');
    
    if (hasLoadingBeenShown) {
      setIsLoading(false);
    } else {
      // Add event listener for when loading is complete
      const handleLoadingComplete = () => {
        setTimeout(() => {
          setIsLoading(false);
          sessionStorage.setItem('loadingShown', 'true');
        }, 1000);
      };
      
      window.addEventListener('loadingComplete', handleLoadingComplete);
      
      // Fallback in case loading screen gets stuck
      const timeout = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem('loadingShown', 'true');
      }, 12000);
      
      return () => {
        window.removeEventListener('loadingComplete', handleLoadingComplete);
        clearTimeout(timeout);
      };
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {isLoading && <LoadingScreen />}
        <BrowserRouter>
          <ErrorBoundary fallback={<ErrorFallback />}>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
