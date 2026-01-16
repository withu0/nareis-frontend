import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdvancedAnalyticsFilters } from '@/components/advertiser/AdvancedAnalyticsFilters';
import { PerformanceCharts } from '@/components/advertiser/PerformanceCharts';
import { DemographicBreakdown } from '@/components/advertiser/DemographicBreakdown';
import { DeviceBrowserStats } from '@/components/advertiser/DeviceBrowserStats';
import { GeographicPerformance } from '@/components/advertiser/GeographicPerformance';
import { ABTestingComparison } from '@/components/advertiser/ABTestingComparison';
import { ROICalculator } from '@/components/advertiser/ROICalculator';
import { ExportReports } from '@/components/advertiser/ExportReports';
import { RealTimeAnalytics } from '@/components/admin/RealTimeAnalytics';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { fetchAnalytics } from '@/lib/analyticsService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function AdvancedAdvertiserAnalytics() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [ads, setAds] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState({ from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() });
  const [selectedAds, setSelectedAds] = useState<string[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    setupRealtimeSubscription();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user?.user_metadata?.role !== 'advertiser') {
      navigate('/advertiser/login');
      return;
    }
    loadAds();
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('analytics_updates')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'analytics_events' },
        () => {
          toast({
            title: "New Click!",
            description: `Your ad received a click just now.`,
            duration: 3000,
          });
          loadAnalytics();
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  };


  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      loadAnalytics();
    }
  }, [dateRange, selectedAds]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadAnalytics();
    }, 10000);
    return () => clearInterval(interval);
  }, []);


  const loadAds = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const { data } = await supabase.from('advertisements').select('*');
    setAds(data || []);
  };

  const loadAnalytics = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    setLoading(true);
    try {
      const data = await fetchAnalytics(
        session.user.id,
        dateRange.from,
        dateRange.to,
        selectedAds.length > 0 ? selectedAds[0] : undefined
      );
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };



  const performanceData = [
    { date: '11/01', impressions: 1200, clicks: 45, ctr: 3.75 },
    { date: '11/08', impressions: 1500, clicks: 60, ctr: 4.0 },
    { date: '11/15', impressions: 1800, clicks: 72, ctr: 4.0 }
  ];

  const ageData = [
    { age: '18-24', impressions: 800, clicks: 32 },
    { age: '25-34', impressions: 1500, clicks: 75 },
    { age: '35-44', impressions: 1200, clicks: 60 }
  ];

  const genderData = [
    { gender: 'Male', value: 55 },
    { gender: 'Female', value: 42 },
    { gender: 'Other', value: 3 }
  ];

  const deviceData = [
    { device: 'Desktop', impressions: 2000, clicks: 100 },
    { device: 'Mobile', impressions: 1500, clicks: 60 },
    { device: 'Tablet', impressions: 500, clicks: 20 }
  ];

  const browserData = [
    { browser: 'Chrome', value: 60 },
    { browser: 'Safari', value: 25 },
    { browser: 'Firefox', value: 10 },
    { browser: 'Edge', value: 5 }
  ];

  const geoData = [
    { location: 'New York', impressions: 1200, clicks: 60, ctr: 5.0 },
    { location: 'California', impressions: 1000, clicks: 45, ctr: 4.5 }
  ];

  const totalStats = ads.reduce((acc, ad) => ({
    spent: acc.spent + (ad.budget || 0),
    impressions: acc.impressions + (ad.impressions || 0),
    clicks: acc.clicks + (ad.clicks || 0)
  }), { spent: 0, impressions: 0, clicks: 0 });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/advertiser/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold mt-2">Advanced Analytics</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <Card className="p-6">
          <div className="flex justify-between items-center">
            <AdvancedAnalyticsFilters dateRange={dateRange} onDateRangeChange={setDateRange} selectedAds={selectedAds} onAdsChange={setSelectedAds} availableAds={ads} />
            <ExportReports data={performanceData} filename="analytics-report" />
          </div>
        </Card>


        {user && <RealTimeAnalytics advertiserId={user.id} />}

        <ROICalculator totalSpent={totalStats.spent} totalImpressions={totalStats.impressions} totalClicks={totalStats.clicks} />


        <Tabs defaultValue="performance">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="geography">Geography</TabsTrigger>
            <TabsTrigger value="abtesting">A/B Testing</TabsTrigger>
          </TabsList>
          <TabsContent value="performance" className="space-y-6">
            <PerformanceCharts data={performanceData} />
          </TabsContent>
          <TabsContent value="demographics">
            <DemographicBreakdown ageData={ageData} genderData={genderData} />
          </TabsContent>
          <TabsContent value="devices">
            <DeviceBrowserStats deviceData={deviceData} browserData={browserData} />
          </TabsContent>
          <TabsContent value="geography">
            <GeographicPerformance data={geoData} />
          </TabsContent>
          <TabsContent value="abtesting">
            <ABTestingComparison ads={ads} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
