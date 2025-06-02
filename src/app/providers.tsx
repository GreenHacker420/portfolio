
'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useState, useEffect } from "react";
import LoadingScreen from "@/components/sections/LoadingScreen";
import dynamic from "next/dynamic";

// Dynamically import client-only components
const AnimatedCursor = dynamic(() => import("@/components/effects/AnimatedCursor"), {
  ssr: false
});

const ReactiveBackground = dynamic(() => import("@/components/effects/ReactiveBackground"), {
  ssr: false
});

const Chatbot = dynamic(() => import("@/components/sections/Chatbot"), {
  ssr: false
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if user is on mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
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
        window.removeEventListener('resize', checkMobile);
        clearTimeout(timeout);
      };
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          
          {isLoading && <LoadingScreen />}
          
          {/* Add reactive background for global effect */}
          <ReactiveBackground />
          
          {/* Only show custom cursor on desktop */}
          {!isMobile && <AnimatedCursor />}
          
          {children}
          
          <Chatbot />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
