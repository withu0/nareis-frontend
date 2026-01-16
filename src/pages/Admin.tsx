import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Users, FileText, Star, Briefcase, Eye, LogOut, TrendingUp, Database, HardDrive, AlertTriangle, ExternalLink, ClipboardList } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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

import { membersDirectory } from '@/data/membersDirectory';
import { supabase } from '@/lib/supabase';

export default function Admin() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('realtime');
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeMembers, setActiveMembers] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [featuredCount, setFeaturedCount] = useState(0);
  const [expiringFeaturedCount, setExpiringFeaturedCount] = useState(0);
  const [fromDatabase, setFromDatabase] = useState(false);
  const [tableExists, setTableExists] = useState(true);

  useEffect(() => { 
    fetchStats(); 
    fetchFeaturedStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.from('customers').select('id, membership_status, approval_status');

      if (error) {
        console.error('Stats fetch error:', error);
        const isMissing = error.message?.includes('schema cache') || error.message?.includes('does not exist');
        setTableExists(!isMissing);
        setTotalUsers(membersDirectory.length);
        setActiveMembers(membersDirectory.length);
        setPendingCount(0);
        setFromDatabase(false);
        return;
      }

      if (!data || data.length === 0) {
        setTotalUsers(membersDirectory.length);
        setActiveMembers(membersDirectory.length);
        setPendingCount(0);
        setFromDatabase(false);
        setTableExists(true);
        return;
      }

      setTotalUsers(data.length);
      setActiveMembers(data.filter(c => c.membership_status === 'active' || c.approval_status === 'approved' || (!c.membership_status && !c.approval_status)).length);
      setPendingCount(data.filter(c => c.approval_status === 'pending').length);
      setFromDatabase(true);
      setTableExists(true);
    } catch {
      setTotalUsers(membersDirectory.length);
      setActiveMembers(membersDirectory.length);
      setPendingCount(0);
      setFromDatabase(false);
    }
  };

  const fetchFeaturedStats = async () => {
    try {
      const { data, error } = await supabase
        .from('featured_memberships')
        .select('id, status, end_date, payment_status');

      if (error) {
        console.error('Featured stats fetch error:', error);
        return;
      }

      const now = new Date();
      const fiveDaysFromNow = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

      const activeFeatured = (data || []).filter(m => 
        m.status === 'active' && 
        m.end_date && 
        new Date(m.end_date) > now
      );

      const expiringSoon = activeFeatured.filter(m => 
        m.end_date && new Date(m.end_date) <= fiveDaysFromNow
      );

      setFeaturedCount(activeFeatured.length);
      setExpiringFeaturedCount(expiringSoon.length);
    } catch (error) {
      console.error('Error fetching featured stats:', error);
    }
  };

  const handleLogout = async () => { await signOut(); navigate('/login'); };

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-blue-600', tab: 'users' },
    { label: 'Active', value: activeMembers, icon: Briefcase, color: 'text-green-600', tab: 'users' },
    { label: 'Pending', value: pendingCount, icon: FileText, color: 'text-orange-600', tab: 'operations', action: () => navigate('/admin/approval-queue') },
    { label: 'Growth', value: '+23.5%', icon: TrendingUp, color: 'text-green-600', tab: 'overview' },
    { 
      label: 'Featured', 
      value: featuredCount, 
      icon: Star, 
      color: expiringFeaturedCount > 0 ? 'text-yellow-600' : 'text-yellow-600', 
      tab: 'overview',
      action: () => navigate('/admin/featured-member-tracking'),
      badge: expiringFeaturedCount > 0 ? expiringFeaturedCount : null
    },
    { label: 'Ads', value: '5', icon: Eye, color: 'text-purple-600', tab: 'adperformance' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 text-white p-3 rounded-lg"><Users className="h-6 w-6" /></div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <Badge variant={fromDatabase ? "default" : "secondary"} className="gap-1">
                  {fromDatabase ? <Database className="h-3 w-3" /> : <HardDrive className="h-3 w-3" />}
                  {fromDatabase ? 'Live' : 'Sample'}
                </Badge>
              </div>
              <p className="text-gray-600 mt-1">Welcome, {user?.email || 'Admin'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/admin/featured-member-tracking')} variant="outline" className="gap-2">
              <Star className="h-4 w-4" />
              Featured Tracking
              {expiringFeaturedCount > 0 && (
                <Badge variant="destructive" className="ml-1">{expiringFeaturedCount}</Badge>
              )}
            </Button>
            <Button onClick={() => navigate('/admin/approval-queue')} variant="outline" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              Approval Queue
              {pendingCount > 0 && (
                <Badge variant="destructive" className="ml-1">{pendingCount}</Badge>
              )}
            </Button>
            <Button onClick={handleLogout} variant="outline" className="gap-2"><LogOut className="h-4 w-4" />Logout</Button>
          </div>
        </div>

        {!tableExists && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800">Database Setup Required</h3>
                <p className="text-sm text-red-700 mt-1">The "customers" table doesn't exist. Run this migration in Supabase SQL Editor:</p>
                <code className="block bg-red-100 p-2 rounded mt-2 text-xs">supabase/migrations/000_create_customers_table.sql</code>
                <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-red-700 hover:text-red-900 mt-2 underline">
                  Open Supabase Dashboard <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map((stat) => (
            <Card 
              key={stat.label} 
              className={`p-4 cursor-pointer hover:shadow-lg transition-all ${stat.badge ? 'border-yellow-400 bg-yellow-50' : ''}`}
              onClick={() => stat.action ? stat.action() : setActiveTab(stat.tab)}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-600">{stat.label}</p>
                <div className="flex items-center gap-1">
                  {stat.badge && (
                    <Badge variant="destructive" className="text-xs px-1 py-0">{stat.badge}</Badge>
                  )}
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="realtime">Real-Time</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="adperformance">Ads</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="cms">CMS</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="realtime"><RealTimeAnalytics /></TabsContent>
          <TabsContent value="overview"><AnalyticsDashboard /></TabsContent>
          <TabsContent value="badges"><BadgeAnalyticsDashboard /></TabsContent>
          <TabsContent value="adperformance">
            <Card className="p-6"><h2 className="text-xl font-semibold mb-4">Ad Performance</h2><Button onClick={() => navigate('/admin/advertisements')}>Manage Ads</Button></Card>
          </TabsContent>
          <TabsContent value="revenue"><RevenueAnalytics /></TabsContent>
          <TabsContent value="operations">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Member Applications</h3>
                      <p className="text-sm text-gray-600">Review and approve new members</p>
                    </div>
                    {pendingCount > 0 && (
                      <Badge variant="destructive">{pendingCount} pending</Badge>
                    )}
                  </div>
                  <Button onClick={() => navigate('/admin/approval-queue')} className="w-full gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Open Approval Queue
                  </Button>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Featured Member Tracking</h3>
                      <p className="text-sm text-gray-600">Monitor placements and expirations</p>
                    </div>
                    {expiringFeaturedCount > 0 && (
                      <Badge variant="destructive">{expiringFeaturedCount} expiring</Badge>
                    )}
                  </div>
                  <Button onClick={() => navigate('/admin/featured-member-tracking')} className="w-full gap-2" variant="outline">
                    <Star className="h-4 w-4" />
                    Open Featured Tracking
                  </Button>
                </Card>
              </div>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Recent Applications</h2>
                <Button onClick={() => navigate('/admin/approval-queue')} variant="link" className="gap-2">
                  View All
                </Button>
              </div>
              <ApplicationManagement />
            </div>
          </TabsContent>
          <TabsContent value="behavior"><ChapterLeaderAnalytics /></TabsContent>
          <TabsContent value="cms"><ContentManagement /></TabsContent>
          <TabsContent value="users"><MemberManagement /></TabsContent>
          <TabsContent value="settings"><div className="space-y-6"><AdminSettings /><BulkEmailComponent /><BroadcastNotifications /></div></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
