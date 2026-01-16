import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Line, LineChart, Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const TIER_PRICES: any = {
  foundation: 199,
  growth: 399,
  professional: 599,
  enterprise: 999,
  'founding-lifetime': 2499,
  'service-partner': 799
};


export default function RevenueProjections() {
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [tierRevenue, setTierRevenue] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [projectedRevenue, setProjectedRevenue] = useState(0);

  const fetchRevenueData = async () => {
    try {
      const { data: members } = await supabase
        .from('customers')
        .select('membership_tier, created_at, approval_status');

      if (members) {
        calculateRevenueData(members);
        calculateTierRevenue(members);
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
    const interval = setInterval(fetchRevenueData, 60000);
    return () => clearInterval(interval);
  }, []);

  const calculateRevenueData = (members: any[]) => {
    const approvedMembers = members.filter(m => m.approval_status === 'approved');
    const monthlyRevenue: any = {};

    approvedMembers.forEach(m => {
      const date = new Date(m.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const revenue = TIER_PRICES[m.membership_tier] || 0;
      
      if (!monthlyRevenue[key]) {
        monthlyRevenue[key] = { actual: 0, individual: 0, professional: 0, corporate: 0, enterprise: 0 };
      }
      monthlyRevenue[key].actual += revenue;
      monthlyRevenue[key][m.membership_tier] = (monthlyRevenue[key][m.membership_tier] || 0) + revenue;
    });

    const sorted = Object.entries(monthlyRevenue).sort().slice(-6);
    const revenueArr = sorted.map(([key, data]: any) => ({
      month: new Date(key + '-01').toLocaleDateString('en-US', { month: 'short' }),
      actual: data.actual,
      projected: data.actual * 1.1,
      individual: data.basic || 0,
      professional: data.professional || 0,
      corporate: data.corporate || 0,
      enterprise: data.enterprise || 0
    }));

    const total = revenueArr.reduce((sum, r) => sum + r.actual, 0);
    const avgGrowth = revenueArr.length > 1 
      ? (revenueArr[revenueArr.length - 1].actual - revenueArr[0].actual) / revenueArr.length 
      : 0;
    
    setTotalRevenue(total);
    setProjectedRevenue(Math.round((revenueArr[revenueArr.length - 1]?.actual || 0) + avgGrowth));
    setRevenueData(revenueArr);
  };

  const calculateTierRevenue = (members: any[]) => {
    const approvedMembers = members.filter(m => m.approval_status === 'approved');
    const tierTotals: any = {};
    let total = 0;

    approvedMembers.forEach(m => {
      const revenue = TIER_PRICES[m.membership_tier] || 0;
      tierTotals[m.membership_tier] = (tierTotals[m.membership_tier] || 0) + revenue;
      total += revenue;
    });

    const tierArr = Object.entries(tierTotals).map(([name, value]: any) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0
    }));

    setTierRevenue(tierArr);
  };

  if (loading) return <div className="flex justify-center p-12"><RefreshCw className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">+18.5%</span>
          </div>
          <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Total Revenue (YTD)</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Next Month</span>
          </div>
          <p className="text-2xl font-bold">${projectedRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Projected Revenue</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Trends & Projections</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Legend />
            <Area type="monotone" dataKey="actual" stackId="1" stroke="#10b981" fill="#10b981" name="Actual Revenue" />
            <Area type="monotone" dataKey="projected" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Projected Revenue" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue by Membership Tier</h3>
        <div className="space-y-4">
          {tierRevenue.map((tier) => (
            <div key={tier.name}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{tier.name}</span>
                <span className="text-sm text-gray-600">${tier.value.toLocaleString()} ({tier.percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${tier.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
