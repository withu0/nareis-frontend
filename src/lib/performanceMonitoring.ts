// Performance monitoring and error tracking
export const initPerformanceMonitoring = () => {
  // Track page load performance
  if (typeof window !== 'undefined' && 'performance' in window) {
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
    });
  }
};

export const trackError = (error: Error, context?: string) => {
  console.error(`Error in ${context}:`, error);
  // In production, send to error tracking service (Sentry, etc.)
  // Commented out to prevent JSON parse errors
};

export const trackMetric = (name: string, value: number) => {
  console.log(`Metric: ${name} = ${value}`);
  // Send to analytics
};
