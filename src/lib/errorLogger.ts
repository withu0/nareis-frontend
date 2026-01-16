// Error logging utility for production monitoring
// Integrate with Sentry, LogRocket, or similar service

interface ErrorLog {
  message: string;
  stack?: string;
  timestamp: string;
  userId?: string;
  url: string;
  userAgent: string;
}

export const logError = (error: Error, userId?: string) => {
  const errorLog: ErrorLog = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    userId,
    url: window.location.href,
    userAgent: navigator.userAgent,
  };

  // Log to console in development
  if (import.meta.env.DEV) {
    console.error('Error logged:', errorLog);
  }

  // Send to error tracking service in production
  if (import.meta.env.PROD) {
    const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
    if (sentryDsn) {
      // Initialize Sentry if DSN is provided
      // Sentry.captureException(error);
    }
    
    // Log to backend (commented out - implement when backend is ready)
    /*
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorLog)
    }).catch(() => {}); // Silently fail if backend unavailable
    */

  }
};

export const logWarning = (message: string, context?: any) => {
  console.warn(message, context);
};
