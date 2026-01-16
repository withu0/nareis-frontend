import { SEOHead } from '@/components/SEOHead';
import { BackButton } from '@/components/ui/back-button';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { SwipeableTabs } from '@/components/mobile/SwipeableTabs';

import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calendar, Heart, TrendingUp, Users, Briefcase, Download, Video, BarChart3, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MembershipStatusCard from '@/components/dashboard/MembershipStatusCard';
import BenefitsUsageCard from '@/components/dashboard/BenefitsUsageCard';
import QuickAccessLinks from '@/components/dashboard/QuickAccessLinks';
import RecentResourcesCard from '@/components/dashboard/RecentResourcesCard';
import UpcomingEventsCard from '@/components/dashboard/UpcomingEventsCard';
import MemberBadges from '@/components/dashboard/MemberBadges';
import IndustryNewsFeed from '@/components/dashboard/IndustryNewsFeed';
import RecentForumActivity from '@/components/dashboard/RecentForumActivity';
import { ROIMetricsCard } from '@/components/dashboard/ROIMetricsCard';
import { ROICharts } from '@/components/dashboard/ROICharts';
import { ROIRecommendations } from '@/components/dashboard/ROIRecommendations';
import AIRecommendations from '@/components/ai/AIRecommendations';
import PersonalizedLearningPaths from '@/components/learning/PersonalizedLearningPaths';
import ActivityFeed from '@/components/activity/ActivityFeed';
import InteractiveTour from '@/components/tour/InteractiveTour';


export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Member';
  const [showTour, setShowTour] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(false);

  useEffect(() => {
    checkTourStatus();
  }, [user]);

  const checkTourStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('onboarding_tours')
        .select('completed')
        .eq('user_id', user.id)
        .eq('tour_type', 'platform_tour')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!data && !error) {
        setShowTour(true);
      } else if (data) {
        setTourCompleted(data.completed);
      }
    } catch (error) {
      console.error('Error checking tour status:', error);
    }
  };


  const stats = [
    { title: 'Saved Resources', value: '18', icon: BookOpen, color: 'text-blue-600' },
    { title: 'Events Registered', value: '3', icon: Calendar, color: 'text-green-600' },
    { title: 'Favorites', value: '12', icon: Heart, color: 'text-red-600' },
    { title: 'Profile Views', value: '47', icon: TrendingUp, color: 'text-purple-600' }
  ];

  // ROI Analytics Data
  const roiMetrics = [
    { label: 'Events Attended', value: 12, estimatedValue: '$3,600', change: 25, icon: <Calendar className="h-4 w-4 text-muted-foreground" /> },
    { label: 'Resources Downloaded', value: 34, estimatedValue: '$1,700', change: 18, icon: <Download className="h-4 w-4 text-muted-foreground" /> },
    { label: 'Connections Made', value: 28, estimatedValue: '$2,800', change: 45, icon: <Users className="h-4 w-4 text-muted-foreground" /> },
    { label: 'Jobs Viewed', value: 15, estimatedValue: '$750', change: -5, icon: <Briefcase className="h-4 w-4 text-muted-foreground" /> }
  ];

  const monthlyData = [
    { month: 'Jan', value: 8 }, { month: 'Feb', value: 12 }, { month: 'Mar', value: 15 },
    { month: 'Apr', value: 10 }, { month: 'May', value: 18 }, { month: 'Jun', value: 22 },
    { month: 'Jul', value: 20 }, { month: 'Aug', value: 25 }, { month: 'Sep', value: 19 },
    { month: 'Oct', value: 23 }, { month: 'Nov', value: 28 }, { month: 'Dec', value: 30 }
  ];

  const categoryData = [
    { category: 'Events', value: 3600 }, { category: 'Resources', value: 1700 },
    { category: 'Networking', value: 2800 }, { category: 'Jobs', value: 750 },
    { category: 'Training', value: 1200 }
  ];

  const recommendations = [
    { title: 'Attend More Webinars', description: 'You\'ve only attended 2 webinars this year. Members who attend 5+ report 40% higher satisfaction.', action: 'Browse Events', link: '/events', potentialValue: '+$1,500' },
    { title: 'Complete Your Profile', description: 'Members with complete profiles get 3x more connections and opportunities.', action: 'Update Profile', link: '/profile', potentialValue: '+$2,000' },
    { title: 'Join Discussion Forums', description: 'Engage with peers in forums. Active participants report 50% more valuable connections.', action: 'Visit Forums', link: '/forums', potentialValue: '+$1,200' }
  ];

  const totalROI = roiMetrics.reduce((sum, metric) => {
    const value = parseInt(metric.estimatedValue.replace(/[$,]/g, ''));
    return sum + value;
  }, 0);

  // Define tab content for swipeable tabs (mobile)
  const overviewContent = (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <QuickAccessLinks />
      <MembershipStatusCard tier="Investor" renewalDate="December 31, 2025" status="active" />
      <UpcomingEventsCard />
      <RecentResourcesCard />
    </div>
  );

  const activityContent = <ActivityFeed />;

  const roiContent = (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-xl">Your Membership ROI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-600">${totalROI.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-2">Annual investment: $2,500</p>
        </CardContent>
      </Card>
      <ROIMetricsCard metrics={roiMetrics} />
    </div>
  );

  const dashboardTabs = [
    { id: 'overview', label: 'Overview', content: overviewContent },
    { id: 'activity', label: 'Activity', content: activityContent },
    { id: 'roi', label: 'ROI', content: roiContent }
  ];

  return (
    <>
      <SEOHead 
        title="Member Dashboard - NAREIS"
        description="Your personalized NAREIS member dashboard with analytics, events, resources, and networking opportunities."
      />
      {showTour && <InteractiveTour autoStart={true} onComplete={() => setShowTour(false)} />}
      
      <div className="min-h-screen bg-gray-50" data-tour="dashboard">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold mb-2">Welcome back, {userName}!</h1>
                <p className="text-blue-100 text-sm md:text-base">Your personalized NAREIS.org member portal</p>
              </div>
              {!tourCompleted && (
                <Button 
                  variant="outline" 
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 min-h-[44px]"
                  onClick={() => setShowTour(true)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Start Platform Tour</span>
                  <span className="sm:hidden">Tour</span>
                </Button>
              )}
            </div>
          </div>
        </div>


        <div className="container mx-auto px-4 py-8">
          <BackButton />

          {/* Mobile: Swipeable Tabs */}
          <div className="md:hidden">
            <SwipeableTabs tabs={dashboardTabs} defaultTab="overview" />
          </div>

          {/* Desktop: Regular Tabs */}
          <div className="hidden md:block">
          <Tabs defaultValue="overview" className="space-y-8">

            <TabsList className="grid w-full max-w-2xl grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity Feed</TabsTrigger>
              <TabsTrigger value="roi">ROI Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid md:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                  <Card key={idx}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <BarChart3 className="h-8 w-8 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">View Your Complete Analytics</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Track your engagement, downloads, events, forum activity, and more
                        </p>
                      </div>
                    </div>
                    <Button onClick={() => navigate('/my-analytics')} className="bg-purple-600 hover:bg-purple-700 text-white">
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <QuickAccessLinks />

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <MembershipStatusCard tier="Investor" renewalDate="December 31, 2025" status="active" />
                </div>
                <div className="lg:col-span-2">
                  <BenefitsUsageCard />
                </div>
              </div>

              <AIRecommendations />
              <PersonalizedLearningPaths />

              <div className="grid lg:grid-cols-2 gap-8">
                <UpcomingEventsCard />
                <RecentForumActivity />
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <RecentResourcesCard />
                <IndustryNewsFeed />
              </div>

              <MemberBadges />
            </TabsContent>

            <TabsContent value="activity" className="space-y-8">
              <ActivityFeed />
            </TabsContent>

            <TabsContent value="roi" className="space-y-8">
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-2xl">Your Membership ROI</CardTitle>
                  <p className="text-sm text-muted-foreground">Estimated value from your NAREIS membership this year</p>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-bold text-green-600">${totalROI.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground mt-2">Annual membership investment: $2,500</p>
                  <p className="text-lg font-semibold text-green-700 mt-1">Return: {((totalROI / 2500) * 100).toFixed(0)}%</p>
                </CardContent>
              </Card>

              <ROIMetricsCard metrics={roiMetrics} />
              <ROICharts monthlyData={monthlyData} categoryData={categoryData} />
              <ROIRecommendations recommendations={recommendations} />
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </div>

    </>
  );
}

