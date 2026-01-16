import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { DollarSign, TrendingUp, Users, Star, Eye, Briefcase } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface RevenueData {
  totalRevenue: number;
  membershipRevenue: number;
  featuredListingRevenue: number;
  advertisementRevenue: number;
  spotlightRevenue: number;
  monthlyTrend: Array<{ month: string; revenue: number; membership: number; featured: number; ads: number; spotlight: number }>;
}

export default function RevenueAnalytics() {
  const [revenueData, setRevenueData] = useState<RevenueData>({
    totalRevenue: 0,
    membershipRevenue: 0,
    featuredListingRevenue: 0,
    advertisementRevenue: 0,
    spotlightRevenue: 0,
    monthlyTrend: []
  });
  const [timeRange, setTimeRange] = useState('12');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueData();
  }, [timeRange]);

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const monthsAgo = parseInt(timeRange);
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - monthsAgo);

      const { data: payments } = await supabase
        .from('payment_history')
        .select('*')
        .eq('status', 'succeeded')
        .gte('created_at', startDate.toISOString());

      if (payments) {
        const total = payments.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);
        const membership = payments.filter(p => p.payment_type === 'membership').reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);
        const featured = payments.filter(p => p.payment_type === 'featured_listing').reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);
        const ads = payments.filter(p => p.payment_type === 'advertisement').reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);
        const spotlight = payments.filter(p => p.payment_type === 'spotlight_application').reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);

        const monthlyData = generateMonthlyTrend(payments, monthsAgo);

        setRevenueData({
          totalRevenue: total,
          membershipRevenue: membership,
          featuredListingRevenue: featured,
          advertisementRevenue: ads,
          spotlightRevenue: spotlight,
          monthlyTrend: monthlyData
        });
      }
    } catch (error) {
      console.error('Error fetching revenue:', error);
    }
    setLoading(false);
  };

  const generateMonthlyTrend = (payments: any[], months: number) => {
    const trend = [];
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      const monthPayments = payments.filter(p => {
        const pDate = new Date(p.created_at);
        return pDate.getMonth() === date.getMonth() && pDate.getFullYear() === date.getFullYear();
      });

      trend.push({
        month: monthStr,
        revenue: monthPayments.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0),
        membership: monthPayments.filter(p => p.payment_type === 'membership').reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0),
        featured: monthPayments.filter(p => p.payment_type === 'featured_listing').reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0),
        ads: monthPayments.filter(p => p.payment_type === 'advertisement').reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0),
        spotlight: monthPayments.filter(p => p.payment_type === 'spotlight_application').reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0)
      });
    }
    return trend;
  };

  const revenueCards = [
    { label: 'Total Revenue', value: revenueData.totalRevenue, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Membership Fees', value: revenueData.membershipRevenue, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Featured Listings', value: revenueData.featuredListingRevenue, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Advertisements', value: revenueData.advertisementRevenue, icon: Eye, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Spotlight Apps', value: revenueData.spotlightRevenue, icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-50' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Revenue Analytics</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Last 3 Months</SelectItem>
            <SelectItem value="6">Last 6 Months</SelectItem>
            <SelectItem value="12">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {revenueCards.map((card) => (
          <Card key={card.label} className={`p-6 ${card.bg}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">{card.label}</p>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>
              ${card.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData.monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
            <Area type="monotone" dataKey="membership" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Membership" />
            <Area type="monotone" dataKey="featured" stackId="1" stroke="#eab308" fill="#eab308" name="Featured" />
            <Area type="monotone" dataKey="ads" stackId="1" stroke="#a855f7" fill="#a855f7" name="Ads" />
            <Area type="monotone" dataKey="spotlight" stackId="1" stroke="#f97316" fill="#f97316" name="Spotlight" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue by Source</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData.monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="membership" fill="#3b82f6" name="Membership" />
            <Bar dataKey="featured" fill="#eab308" name="Featured" />
            <Bar dataKey="ads" fill="#a855f7" name="Ads" />
            <Bar dataKey="spotlight" fill="#f97316" name="Spotlight" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
