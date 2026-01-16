import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Calendar, FileText, DollarSign, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import ApprovalMetrics from './ApprovalMetrics';
import RevenueProjections from './RevenueProjections';
import ExportReports from './ExportReports';
import { AnalyticsFilters } from '@/components/analytics/AnalyticsFilters';
import { EngagementMetrics } from '@/components/analytics/EngagementMetrics';
import { EventAnalytics } from '@/components/analytics/EventAnalytics';
import { ResourceAnalytics } from '@/components/analytics/ResourceAnalytics';
import { ForumActivityHeatmap } from '@/components/analytics/ForumActivityHeatmap';
import { RetentionAnalytics } from '@/components/analytics/RetentionAnalytics';
import { AtRiskMembers } from '@/components/analytics/AtRiskMembers';


export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const [membershipGrowth, setMembershipGrowth] = useState<any[]>([]);
  const [tierDistribution, setTierDistribution] = useState<any[]>([]);
  const [eventAttendance, setEventAttendance] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any[]>([]);
  
  const [dateRange, setDateRange] = useState({ from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() });
  const [selectedChapter, setSelectedChapter] = useState('all');

  const handleExport = (format: 'csv' | 'pdf' | 'xlsx') => {
    toast({ title: 'Exporting', description: `Generating ${format.toUpperCase()} report...` });
    // Export logic would go here
  };

  const fetchAnalytics = async () => {
    try {
      const { data: members } = await supabase.from('customers').select('*');
      const { data: events } = await supabase.from('events').select('*, event_registrations(*)');
      const { data: resources } = await supabase.from('resources').select('downloads');

      if (members) {
        calculateMembershipGrowth(members);
        calculateTierDistribution(members);
        calculateKPIs(members, events || [], resources || []);
      }

      if (events) calculateEventAttendance(events);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch analytics', variant: 'destructive' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
  };

  const calculateMembershipGrowth = (members: any[]) => {
    const monthlyData: any = {};
    members.forEach(m => {
      const date = new Date(m.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[key] = (monthlyData[key] || 0) + 1;
    });

    const sorted = Object.entries(monthlyData).sort();
    let cumulative = 0;
    const growth = sorted.slice(-6).map(([key, count]: any) => {
      cumulative += count;
      return { month: key.split('-')[1], members: cumulative, newMembers: count };
    });
    setMembershipGrowth(growth);
  };

  const calculateTierDistribution = (members: any[]) => {
    const tiers: any = {};
    members.forEach(m => {
      const tier = m.membership_tier || 'basic';
      tiers[tier] = (tiers[tier] || 0) + 1;
    });

    const colors: any = { basic: '#3b82f6', professional: '#8b5cf6', corporate: '#10b981', enterprise: '#f59e0b' };
    const dist = Object.entries(tiers).map(([name, value]) => ({ 
      name: name.charAt(0).toUpperCase() + name.slice(1), 
      value, 
      color: colors[name] || '#6b7280' 
    }));
    setTierDistribution(dist);
  };

  const calculateEventAttendance = (events: any[]) => {
    const attendance = events.slice(0, 5).map(e => ({
      event: e.title?.substring(0, 15) || 'Event',
      attendees: e.event_registrations?.length || 0
    }));
    setEventAttendance(attendance);
  };

  const calculateKPIs = (members: any[], events: any[], resources: any[]) => {
    const tierPrices: any = { basic: 99, professional: 299, corporate: 999, enterprise: 2499 };
    const revenue = members.reduce((sum, m) => sum + (tierPrices[m.membership_tier] || 0), 0);
    const totalDownloads = resources.reduce((sum, r) => sum + (r.downloads || 0), 0);
    const totalAttendees = events.reduce((sum, e) => sum + (e.event_registrations?.length || 0), 0);

    setKpis([
      { label: 'Total Revenue', value: `$${revenue.toLocaleString()}`, change: '+12.5%', icon: DollarSign, color: 'text-green-600' },
      { label: 'Active Members', value: members.length.toString(), change: '+8.2%', icon: Users, color: 'text-blue-600' },
      { label: 'Event Attendance', value: totalAttendees.toString(), change: '+15.3%', icon: Calendar, color: 'text-purple-600' },
      { label: 'Resource Downloads', value: totalDownloads.toString(), change: '+22.1%', icon: FileText, color: 'text-orange-600' },
    ]);
  };

  if (loading) return <div className="flex justify-center p-12"><RefreshCw className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Advanced Analytics Dashboard</h2>
        <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <AnalyticsFilters 
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onExport={handleExport}
        selectedChapter={selectedChapter}
        onChapterChange={setSelectedChapter}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="forums">Forums</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="risk">At-Risk</TabsTrigger>
        </TabsList>


        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <Card key={kpi.label} className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                  <span className="text-sm font-medium text-green-600">{kpi.change}</span>
                </div>
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-sm text-gray-600">{kpi.label}</p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Membership Growth</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={membershipGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="members" stroke="#3b82f6" strokeWidth={2} name="Total Members" />
                  <Line type="monotone" dataKey="newMembers" stroke="#10b981" strokeWidth={2} name="New Members" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Membership Tiers</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={tierDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {tierDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Event Attendance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventAttendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="event" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attendees" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="engagement">
          <EngagementMetrics />
        </TabsContent>

        <TabsContent value="events">
          <EventAnalytics />
        </TabsContent>

        <TabsContent value="resources">
          <ResourceAnalytics />
        </TabsContent>

        <TabsContent value="forums">
          <ForumActivityHeatmap />
        </TabsContent>

        <TabsContent value="retention">
          <RetentionAnalytics />
        </TabsContent>

        <TabsContent value="risk">
          <AtRiskMembers />
        </TabsContent>
      </Tabs>
    </div>
  );
}
