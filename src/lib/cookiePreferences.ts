export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export const getCookiePreferences = (): CookiePreferences => {
  const saved = localStorage.getItem('cookiePreferences');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return { essential: true, analytics: false, marketing: false };
    }
  }
  return { essential: true, analytics: false, marketing: false };
};

export const hasAnalyticsConsent = (): boolean => {
  const prefs = getCookiePreferences();
  return prefs.analytics;
};

export const hasMarketingConsent = (): boolean => {
  const prefs = getCookiePreferences();
  return prefs.marketing;
};

export const hasConsentFor = (type: keyof CookiePreferences): boolean => {
  const prefs = getCookiePreferences();
  return prefs[type];
};
