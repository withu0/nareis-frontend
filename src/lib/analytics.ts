import { hasAnalyticsConsent } from './cookiePreferences';

// Google Analytics Integration
export const initAnalytics = () => {
  // Only initialize if user has consented to analytics cookies
  if (!hasAnalyticsConsent()) {
    return;
  }

  const gaId = import.meta.env.VITE_GA_TRACKING_ID;
  
  if (gaId && typeof window !== 'undefined') {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', gaId);
  }
};


export const trackPageView = (url: string) => {
  if (!hasAnalyticsConsent()) return;
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA_TRACKING_ID, {
      page_path: url,
    });
  }
};


export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (!hasAnalyticsConsent()) return;
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};


declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
