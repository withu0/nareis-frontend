import { SEOHead } from '@/components/SEOHead';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { SwipeableTabs } from '@/components/mobile/SwipeableTabs';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, Calendar, Heart, TrendingUp, Users, Briefcase, Download, Video, BarChart3, Play, ArrowUpRight, Award, Target, Zap, MessageSquare, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
      // TODO: Implement onboarding tours in Node.js backend if needed
      // For now, check localStorage for tour completion
      const tourStatus = localStorage.getItem(`tour_completed_${user.id}`);
      if (tourStatus === 'true') {
        setTourCompleted(true);
      } else {
        // Show tour to new users
        setShowTour(true);
      }
    } catch (error) {
      console.error('Error checking tour status:', error);
    }
  };


  const stats = [
    { title: 'Saved Resources', value: '18', icon: BookOpen, color: 'text-teal-600', bgColor: 'bg-teal-50', trend: '+12%' },
    { title: 'Events Registered', value: '3', icon: Calendar, color: 'text-emerald-600', bgColor: 'bg-emerald-50', trend: '+25%' },
    { title: 'Network Connections', value: '47', icon: Users, color: 'text-cyan-600', bgColor: 'bg-cyan-50', trend: '+8%' },
    { title: 'Learning Progress', value: '68%', icon: Target, color: 'text-indigo-600', bgColor: 'bg-indigo-50', trend: '+15%' }
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
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="relative overflow-hidden border-0 shadow-lg">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bgColor} rounded-full -mr-12 -mt-12 opacity-50`}></div>
            <CardHeader className="pb-2">
              <div className={`p-2 ${stat.bgColor} rounded-lg w-fit mb-2`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <CardTitle className="text-xs font-medium text-gray-600">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <Badge variant="outline" className="text-xs mt-1 border-emerald-200 text-emerald-700">
                {stat.trend}
              </Badge>
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
      <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <CardHeader className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <Badge className="bg-white/20 text-white border-white/30 text-xs">This Year</Badge>
          </div>
          <CardTitle className="text-2xl text-white">Your Membership ROI</CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-end gap-3 mb-3">
            <div className="text-5xl font-bold text-white">${totalROI.toLocaleString()}</div>
            <div className="bg-emerald-400/30 backdrop-blur-sm px-2 py-1 rounded-full mb-1">
              <p className="text-lg font-bold text-white">+{((totalROI / 2500) * 100).toFixed(0)}%</p>
            </div>
          </div>
          <p className="text-sm text-teal-100">Annual investment: $2,500</p>
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
    <DashboardLayout>
      <SEOHead 
        title="Member Dashboard - NAREIS"
        description="Your personalized NAREIS member dashboard with analytics, events, resources, and networking opportunities."
      />
      {showTour && <InteractiveTour autoStart={true} onComplete={() => setShowTour(false)} />}
      
      <div data-tour="dashboard">
        {/* Modern Header with Gradient */}
        <div className="relative bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
          
          <div className="relative container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    <Zap className="w-3 h-3 mr-1" />
                    Premium Member
                  </Badge>
                  <Badge className="bg-emerald-500/20 text-white border-emerald-300/30">
                    Active
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-teal-100">
                  Welcome back, {userName}!
                </h1>
                <p className="text-teal-50 text-sm md:text-lg font-medium">
                  Your personalized NAREIS member dashboard
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {!tourCompleted && (
                  <Button 
                    variant="outline" 
                    className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm min-h-[44px]"
                    onClick={() => setShowTour(true)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Platform Tour</span>
                    <span className="sm:hidden">Tour</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>


        <div className="container mx-auto px-4 py-8">

          {/* Mobile: Swipeable Tabs */}
          <div className="md:hidden">
            <SwipeableTabs tabs={dashboardTabs} defaultTab="overview" />
          </div>

          {/* Desktop: Regular Tabs */}
          <div className="hidden md:block">
          <Tabs defaultValue="overview" className="space-y-8">

            <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-white shadow-md border-0 p-1.5">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="activity" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                Activity Feed
              </TabsTrigger>
              <TabsTrigger 
                value="roi" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                ROI Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Modern Stats Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                  <Card key={idx} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor} rounded-full -mr-16 -mt-16 opacity-50`}></div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                          {stat.trend}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                      <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Featured Action Card */}
              <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500">
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
                <CardContent className="relative p-6 md:p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                        <BarChart3 className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-white">
                        <h3 className="text-2xl font-bold mb-2">Unlock Your Growth Insights</h3>
                        <p className="text-teal-50 text-sm md:text-base mb-3">
                          Track your engagement, downloads, events, forum activity, and discover personalized recommendations
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <Award className="w-4 h-4" />
                          <span className="font-medium">Advanced Analytics Available</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => navigate('/my-analytics')} 
                      size="lg"
                      className="bg-white text-teal-600 hover:bg-teal-50 font-semibold shadow-lg whitespace-nowrap"
                    >
                      View Analytics
                      <ArrowUpRight className="ml-2 h-4 w-4" />
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
              {/* ROI Hero Card */}
              <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500">
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <CardHeader className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30">This Year</Badge>
                  </div>
                  <CardTitle className="text-3xl text-white">Your Membership ROI</CardTitle>
                  <CardDescription className="text-teal-50 text-base">
                    Estimated value from your NAREIS membership this year
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="flex items-end gap-4 mb-4">
                    <div className="text-6xl font-bold text-white">${totalROI.toLocaleString()}</div>
                    <div className="bg-emerald-400/30 backdrop-blur-sm px-3 py-1 rounded-full mb-2">
                      <p className="text-2xl font-bold text-white">+{((totalROI / 2500) * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-white/90">
                    <div>
                      <p className="text-sm text-teal-100">Investment</p>
                      <p className="text-xl font-semibold">$2,500</p>
                    </div>
                    <div className="h-8 w-px bg-white/30"></div>
                    <div>
                      <p className="text-sm text-teal-100">Return</p>
                      <p className="text-xl font-semibold">${(totalROI - 2500).toLocaleString()}</p>
                    </div>
                  </div>
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
    </DashboardLayout>
  );
}

