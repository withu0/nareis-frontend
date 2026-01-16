import { supabase } from './supabase';

export interface AnalyticsData {
  totalImpressions: number;
  totalClicks: number;
  ctr: number;
  timeSeriesData: Array<{ date: string; impressions: number; clicks: number }>;
  deviceData: Array<{ device: string; impressions: number; clicks: number }>;
  browserData: Array<{ browser: string; count: number }>;
  locationData: Array<{ location: string; impressions: number; clicks: number }>;
  demographicData: {
    ageGroups: Array<{ age_group: string; count: number }>;
    gender: Array<{ gender: string; count: number }>;
  };
}

export const fetchAnalytics = async (
  advertiserId: string,
  startDate: Date,
  endDate: Date,
  adId?: string
): Promise<AnalyticsData> => {
  try {
    let query = supabase
      .from('analytics_events')
      .select('*')
      .eq('advertiser_id', advertiserId)
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString());

    if (adId) {
      query = query.eq('ad_id', adId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const events = data || [];
    const impressions = events.filter(e => e.event_type === 'impression');
    const clicks = events.filter(e => e.event_type === 'click');

    return {
      totalImpressions: impressions.length,
      totalClicks: clicks.length,
      ctr: impressions.length > 0 ? (clicks.length / impressions.length) * 100 : 0,
      timeSeriesData: aggregateByDate(events),
      deviceData: aggregateByDevice(events),
      browserData: aggregateByBrowser(events),
      locationData: aggregateByLocation(events),
      demographicData: {
        ageGroups: aggregateByAgeGroup(events),
        gender: aggregateByGender(events),
      },
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

const aggregateByDate = (events: any[]) => {
  const grouped: Record<string, { impressions: number; clicks: number }> = {};
  events.forEach(e => {
    const date = new Date(e.timestamp).toISOString().split('T')[0];
    if (!grouped[date]) grouped[date] = { impressions: 0, clicks: 0 };
    if (e.event_type === 'impression') grouped[date].impressions++;
    else grouped[date].clicks++;
  });
  return Object.entries(grouped).map(([date, data]) => ({ date, ...data }));
};

const aggregateByDevice = (events: any[]) => {
  const grouped: Record<string, { impressions: number; clicks: number }> = {};
  events.forEach(e => {
    const device = e.device_type || 'Unknown';
    if (!grouped[device]) grouped[device] = { impressions: 0, clicks: 0 };
    if (e.event_type === 'impression') grouped[device].impressions++;
    else grouped[device].clicks++;
  });
  return Object.entries(grouped).map(([device, data]) => ({ device, ...data }));
};

const aggregateByBrowser = (events: any[]) => {
  const grouped: Record<string, number> = {};
  events.forEach(e => {
    const browser = e.browser || 'Unknown';
    grouped[browser] = (grouped[browser] || 0) + 1;
  });
  return Object.entries(grouped).map(([browser, count]) => ({ browser, count }));
};

const aggregateByLocation = (events: any[]) => {
  const grouped: Record<string, { impressions: number; clicks: number }> = {};
  events.forEach(e => {
    const location = e.country || 'Unknown';
    if (!grouped[location]) grouped[location] = { impressions: 0, clicks: 0 };
    if (e.event_type === 'impression') grouped[location].impressions++;
    else grouped[location].clicks++;
  });
  return Object.entries(grouped).map(([location, data]) => ({ location, ...data }));
};

const aggregateByAgeGroup = (events: any[]) => {
  const grouped: Record<string, number> = {};
  events.forEach(e => {
    const age = e.age_group || 'Unknown';
    grouped[age] = (grouped[age] || 0) + 1;
  });
  return Object.entries(grouped).map(([age_group, count]) => ({ age_group, count }));
};

const aggregateByGender = (events: any[]) => {
  const grouped: Record<string, number> = {};
  events.forEach(e => {
    const gender = e.gender || 'Unknown';
    grouped[gender] = (grouped[gender] || 0) + 1;
  });
  return Object.entries(grouped).map(([gender, count]) => ({ gender, count }));
};
