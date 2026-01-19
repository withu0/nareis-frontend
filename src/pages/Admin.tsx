import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Users, Briefcase, TrendingUp, Database, HardDrive } from 'lucide-react';
import MemberManagement from '@/components/admin/MemberManagement';
import ApplicationManagement from '@/components/admin/ApplicationManagement';
import { BulkEmailComponent } from '@/components/admin/BulkEmailComponent';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import ChapterLeaderAnalytics from '@/components/admin/ChapterLeaderAnalytics';
import ContentManagement from '@/components/admin/ContentManagement';
import RevenueAnalytics from '@/components/admin/RevenueAnalytics';
import BadgeAnalyticsDashboard from '@/components/admin/BadgeAnalyticsDashboard';
import BroadcastNotifications from '@/components/admin/BroadcastNotifications';
import { RealTimeAnalytics } from '@/components/admin/RealTimeAnalytics';
import AdminSettings from '@/components/admin/AdminSettings';
import { Badge } from '@/components/ui/badge';
import { AdminLayout } from '@/components/admin/AdminLayout';
import EventManagement from '@/components/admin/EventManagement';

import { adminAPI } from '@/lib/api';

export default function Admin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeMembers, setActiveMembers] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [expiringFeaturedCount, setExpiringFeaturedCount] = useState(0);
  const [fromDatabase, setFromDatabase] = useState(false);

  useEffect(() => { 
    fetchStats(); 
    fetchFeaturedStats();
  }, []);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab('overview');
    }
  }, [searchParams]);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      
      if (response.data) {
        setTotalUsers(response.data.totalUsers || 0);
        setActiveMembers(response.data.activeUsers || 0);
        setPendingCount(response.data.pendingUsers || 0);
        setFromDatabase(true);
      }
    } catch (error) {
      console.error('Stats fetch error:', error);
      setTotalUsers(0);
      setActiveMembers(0);
      setPendingCount(0);
      setFromDatabase(false);
    }
  };

  const fetchFeaturedStats = async () => {
    try {
      // Featured memberships not implemented in Node.js backend yet
      // TODO: Implement featured memberships API endpoint
      setExpiringFeaturedCount(0);
    } catch (error) {
      console.error('Error fetching featured stats:', error);
      setExpiringFeaturedCount(0);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-blue-600' },
    { label: 'Active Members', value: activeMembers, icon: Briefcase, color: 'text-green-600' },
    { label: 'Pending Approval', value: pendingCount, icon: Users, color: 'text-orange-600' },
    { label: 'Growth Rate', value: '+23.5%', icon: TrendingUp, color: 'text-green-600' },
  ];

  return (
    <AdminLayout stats={{ pendingCount, expiringFeaturedCount }}>
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        {/* <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="flex flex-wrap gap-2 bg-white p-2 rounded-lg border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="realtime">Real-Time</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="cms">CMS</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AnalyticsDashboard />
          </TabsContent>
          
          <TabsContent value="realtime">
            <RealTimeAnalytics />
          </TabsContent>
          
          <TabsContent value="users">
            <MemberManagement />
          </TabsContent>

          <TabsContent value="events">
            <EventManagement />
          </TabsContent>
          
          <TabsContent value="operations">
            <ApplicationManagement />
          </TabsContent>
          
          <TabsContent value="badges">
            <BadgeAnalyticsDashboard />
          </TabsContent>
          
          <TabsContent value="revenue">
            <RevenueAnalytics />
          </TabsContent>
          
          <TabsContent value="behavior">
            <ChapterLeaderAnalytics />
          </TabsContent>
          
          <TabsContent value="cms">
            <ContentManagement />
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-6">
              <AdminSettings />
              <BulkEmailComponent />
              <BroadcastNotifications />
            </div>
          </TabsContent>
        </Tabs> */}
      </div>
    </AdminLayout>
  );
}
