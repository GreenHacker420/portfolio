'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';

interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

const WebVitals = () => {
  useEffect(() => {
    // Only run in production and if web vitals API is available
    if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined') {
      return;
    }

    // Function to send metrics to analytics
    const sendToAnalytics = (metric: WebVitalsMetric) => {
      // Send to Google Analytics
      trackEvent({
        action: 'web_vitals',
        category: 'performance',
        label: metric.name,
        value: Math.round(metric.value)
      });

      // Also send detailed metric data
      if (window.gtag) {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.value),
          custom_parameter_rating: metric.rating,
          custom_parameter_delta: Math.round(metric.delta),
          non_interaction: true
        });
      }

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Web Vitals:', metric);
      }
    };

    // Dynamically import web-vitals library
    import('web-vitals').then((webVitals) => {
      // Cumulative Layout Shift
      if (webVitals.onCLS) {
        webVitals.onCLS(sendToAnalytics);
      }

      // First Contentful Paint
      if (webVitals.onFCP) {
        webVitals.onFCP(sendToAnalytics);
      }

      // Largest Contentful Paint
      if (webVitals.onLCP) {
        webVitals.onLCP(sendToAnalytics);
      }

      // Time to First Byte
      if (webVitals.onTTFB) {
        webVitals.onTTFB(sendToAnalytics);
      }

      // Interaction to Next Paint (replaces FID in web-vitals v5)
      if (webVitals.onINP) {
        webVitals.onINP(sendToAnalytics);
      }
    }).catch((error) => {
      console.warn('Failed to load web-vitals:', error);
    });

    // Additional performance monitoring
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Track long tasks (> 50ms)
        if (entry.entryType === 'longtask') {
          trackEvent({
            action: 'long_task',
            category: 'performance',
            label: 'main_thread_blocking',
            value: Math.round(entry.duration)
          });
        }

        // Track navigation timing
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;

          // DOM Content Loaded
          const domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart;
          trackEvent({
            action: 'dom_content_loaded',
            category: 'performance',
            label: 'page_load',
            value: Math.round(domContentLoaded)
          });

          // Page Load Complete
          const loadComplete = navEntry.loadEventEnd - navEntry.loadEventStart;
          trackEvent({
            action: 'load_complete',
            category: 'performance',
            label: 'page_load',
            value: Math.round(loadComplete)
          });
        }

        // Track resource loading
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;

          // Track slow resources (> 1s)
          if (resourceEntry.duration > 1000) {
            trackEvent({
              action: 'slow_resource',
              category: 'performance',
              label: resourceEntry.initiatorType || 'unknown',
              value: Math.round(resourceEntry.duration)
            });
          }
        }
      }
    });

    // Observe performance entries
    try {
      observer.observe({ entryTypes: ['longtask', 'navigation', 'resource'] });
    } catch (error) {
      console.warn('Performance observer not supported:', error);
    }

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        trackEvent({
          action: 'page_hidden',
          category: 'engagement',
          label: 'visibility_change'
        });
      } else {
        trackEvent({
          action: 'page_visible',
          category: 'engagement',
          label: 'visibility_change'
        });
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    // Track user engagement time
    let startTime = Date.now();
    let isActive = true;

    const trackEngagementTime = () => {
      if (isActive) {
        const engagementTime = Date.now() - startTime;
        if (engagementTime > 10000) { // Only track if user was engaged for > 10s
          trackEvent({
            action: 'engagement_time',
            category: 'engagement',
            label: 'session_duration',
            value: Math.round(engagementTime / 1000) // Convert to seconds
          });
        }
      }
    };

    // Track when user becomes inactive
    const handleUserInactive = () => {
      isActive = false;
      trackEngagementTime();
    };

    // Track when user becomes active again
    const handleUserActive = () => {
      if (!isActive) {
        isActive = true;
        startTime = Date.now();
      }
    };

    // Listen for user activity
    if (typeof document !== 'undefined') {
      ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, handleUserActive, { passive: true });
      });
    }

    // Track when user leaves the page
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleUserInactive);
    }

    // Cleanup
    return () => {
      observer.disconnect();
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
          document.removeEventListener(event, handleUserActive);
        });
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', handleUserInactive);
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default WebVitals;
