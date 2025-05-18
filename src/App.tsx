
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/common/ErrorBoundary";

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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

export default App;
