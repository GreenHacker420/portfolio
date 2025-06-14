
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

const EnhancedChatbot = dynamic(() => import("@/components/sections/EnhancedChatbot"), {
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
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Only run on client side
    if (typeof window === 'undefined') return;

    // Check if current route is an admin route
    const checkAdminRoute = () => {
      setIsAdminRoute(window.location.pathname.startsWith('/admin'));
    };

    checkAdminRoute();

    // Check if user is on mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Skip loading screen for admin routes
    if (window.location.pathname.startsWith('/admin')) {
      setIsLoading(false);
      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    }

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

          {/* Only show GreenHacker loading screen on non-admin routes */}
          {!isAdminRoute && isLoading && <LoadingScreen />}

          {/* Only show portfolio effects on non-admin routes */}
          {!isAdminRoute && <ReactiveBackground />}

          {/* Only show custom cursor on desktop and non-admin routes */}
          {!isAdminRoute && !isMobile && <AnimatedCursor />}

          {children}

          {/* Only show enhanced chatbot on non-admin routes */}
          {!isAdminRoute && <EnhancedChatbot />}
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
