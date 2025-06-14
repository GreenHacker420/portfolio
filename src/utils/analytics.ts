/**
 * Analytics utility for tracking user interactions
 */

// Portfolio event types
export const portfolioEvents = {
  CHATBOT_OPENED: 'chatbot_opened',
  CHATBOT_CLOSED: 'chatbot_closed',
  CHATBOT_MESSAGE_SENT: 'chatbot_message_sent',
  CONTACT_FORM_SUBMITTED: 'contact_form_submitted',
  PROJECT_VIEWED: 'project_viewed',
  SKILL_CLICKED: 'skill_clicked',
  GITHUB_STATS_VIEWED: 'github_stats_viewed',
  RESUME_DOWNLOADED: 'resume_downloaded',
  SOCIAL_LINK_CLICKED: 'social_link_clicked',
} as const;

export type PortfolioEvent = typeof portfolioEvents[keyof typeof portfolioEvents];

/**
 * Track an event with Google Analytics
 */
export function trackEvent(
  eventName: PortfolioEvent,
  parameters?: Record<string, any>
): void {
  try {
    // Check if gtag is available (Google Analytics)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', eventName, {
        event_category: 'portfolio_interaction',
        event_label: parameters?.label || '',
        value: parameters?.value || 0,
        ...parameters,
      });
    }

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', eventName, parameters);
    }
  } catch (error) {
    console.warn('Failed to track analytics event:', error);
  }
}

/**
 * Track page view
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  try {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: pagePath,
        page_title: pageTitle,
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Page View:', pagePath, pageTitle);
    }
  } catch (error) {
    console.warn('Failed to track page view:', error);
  }
}

/**
 * Track custom conversion events
 */
export function trackConversion(conversionName: string, value?: number): void {
  try {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'conversion', {
        send_to: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
        event_category: 'conversion',
        event_label: conversionName,
        value: value || 0,
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Conversion Event:', conversionName, value);
    }
  } catch (error) {
    console.warn('Failed to track conversion:', error);
  }
}

/**
 * Initialize analytics
 */
export function initializeAnalytics(): void {
  try {
    // Google Analytics initialization is handled in _app.tsx or layout.tsx
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics initialized');
    }
  } catch (error) {
    console.warn('Failed to initialize analytics:', error);
  }
}
