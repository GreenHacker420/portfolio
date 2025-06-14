'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

// Custom event types for better type safety
export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

// Predefined events for the portfolio
export const portfolioEvents = {
  // Resume interactions
  resumeView: {
    action: 'view_resume',
    category: 'resume',
    label: 'pdf_preview'
  },
  resumeDownload: {
    action: 'download_resume',
    category: 'resume',
    label: 'pdf_download'
  },
  resumeError: {
    action: 'resume_error',
    category: 'resume',
    label: 'pdf_load_failed'
  },
  
  // Contact interactions
  contactFormSubmit: {
    action: 'submit_form',
    category: 'contact',
    label: 'contact_form'
  },
  
  // Project interactions
  projectView: {
    action: 'view_project',
    category: 'projects',
    label: 'project_details'
  },
  projectLink: {
    action: 'click_project_link',
    category: 'projects',
    label: 'external_link'
  },
  
  // GitHub stats
  githubStatsView: {
    action: 'view_github_stats',
    category: 'github',
    label: 'stats_display'
  },
  
  // AI Chat interactions
  aiChatStart: {
    action: 'start_chat',
    category: 'ai_chat',
    label: 'terminal_chat'
  },
  aiChatMessage: {
    action: 'send_message',
    category: 'ai_chat',
    label: 'user_message'
  },
  
  // 3D interactions
  threeDInteraction: {
    action: 'interact_3d',
    category: '3d_elements',
    label: 'canvas_interaction'
  },
  
  // Navigation
  sectionView: {
    action: 'view_section',
    category: 'navigation',
    label: 'scroll_to_section'
  }
};

// Global gtag function declaration
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: any
    ) => void;
  }
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ 
  measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID 
}) => {
  useEffect(() => {
    if (!measurementId) {
      console.warn('Google Analytics measurement ID not provided');
      return;
    }

    // Initialize GA4 when the script loads
    window.gtag = window.gtag || function() {
      (window.gtag as any).q = (window.gtag as any).q || [];
      (window.gtag as any).q.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_title: 'Harsh Hirawat (GreenHacker) Portfolio',
      page_location: window.location.href,
      send_page_view: true,
      // Enhanced measurement for better insights
      enhanced_measurement: {
        scrolls: true,
        outbound_clicks: true,
        site_search: true,
        video_engagement: true,
        file_downloads: true
      },
      // Custom parameters for portfolio tracking
      custom_map: {
        'custom_parameter_1': 'section_name',
        'custom_parameter_2': 'interaction_type'
      }
    });

    // Track initial page view
    trackEvent({
      action: 'page_view',
      category: 'engagement',
      label: 'initial_load'
    });

  }, [measurementId]);

  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
    </>
  );
};

// Utility function to track custom events
export const trackEvent = (event: GAEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      // Add timestamp for better analytics
      custom_parameter_timestamp: new Date().toISOString()
    });
  }
};

// Utility function to track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
      page_location: url,
      page_title: title || document.title
    });
  }
};

// Utility function to track user engagement
export const trackEngagement = (engagementTime: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'user_engagement', {
      engagement_time_msec: engagementTime
    });
  }
};

// Utility function to track conversions (e.g., contact form submissions)
export const trackConversion = (conversionName: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
      event_category: 'conversion',
      event_label: conversionName,
      value: value
    });
  }
};

export default GoogleAnalytics;
