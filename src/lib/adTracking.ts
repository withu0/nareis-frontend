import { supabase } from './supabase';
import { hasMarketingConsent } from './cookiePreferences';


// Detect device type from user agent
export const getDeviceType = (): string => {
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) return 'Mobile';
  if (/tablet|ipad/i.test(ua)) return 'Tablet';
  return 'Desktop';
};

// Detect browser
export const getBrowser = (): string => {
  const ua = navigator.userAgent;
  if (/chrome/i.test(ua) && !/edge/i.test(ua)) return 'Chrome';
  if (/firefox/i.test(ua)) return 'Firefox';
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return 'Safari';
  if (/edge/i.test(ua)) return 'Edge';
  return 'Other';
};

// Detect OS
export const getOS = (): string => {
  const ua = navigator.userAgent;
  if (/windows/i.test(ua)) return 'Windows';
  if (/mac/i.test(ua)) return 'macOS';
  if (/linux/i.test(ua)) return 'Linux';
  if (/android/i.test(ua)) return 'Android';
  if (/ios|iphone|ipad/i.test(ua)) return 'iOS';
  return 'Other';
};

// Track ad event (impression or click)
export const trackAdEvent = async (
  adId: string,
  advertiserId: string,
  eventType: 'impression' | 'click'
) => {
  // Only track if user has consented to marketing cookies
  if (!hasMarketingConsent()) {
    return;
  }

  try {

    const eventData = {
      ad_id: adId,
      advertiser_id: advertiserId,
      event_type: eventType,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      device_type: getDeviceType(),
      browser: getBrowser(),
      os: getOS(),
    };

    // Insert into analytics_events table
    const { error } = await supabase
      .from('analytics_events')
      .insert(eventData);

    if (error) {
      console.error('Error tracking ad event:', error);
    }
  } catch (error) {
    console.error('Error tracking ad event:', error);
  }
};
