import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle, Clock, XCircle, TrendingUp, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ApprovalMetrics() {
  const [loading, setLoading] = useState(true);
  const [approvalRateData, setApprovalRateData] = useState<any[]>([]);
  const [pendingAppsData, setPendingAppsData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);

  const fetchApprovalMetrics = async () => {
    try {
      const { data: members } = await supabase
        .from('customers')
        .select('approval_status, approved_at, rejected_at, created_at');

      if (members) {
        calculateApprovalRate(members);
        calculatePendingApps(members);
        calculateMetrics(members);
      }
    } catch (error) {
      console.error('Error fetching approval metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovalMetrics();
    const interval = setInterval(fetchApprovalMetrics, 60000);
    return () => clearInterval(interval);
  }, []);

  const calculateApprovalRate = (members: any[]) => {
    const monthlyData: any = {};
    members.forEach(m => {
      const date = m.approved_at || m.rejected_at;
      if (!date) return;
      const d = new Date(date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[key]) monthlyData[key] = { approved: 0, rejected: 0 };
      if (m.approval_status === 'approved') monthlyData[key].approved++;
      else if (m.approval_status === 'rejected') monthlyData[key].rejected++;
    });

    const sorted = Object.entries(monthlyData).sort().slice(-6);
    const rateData = sorted.map(([key, data]: any) => {
      const total = data.approved + data.rejected;
      const rate = total > 0 ? Math.round((data.approved / total) * 100) : 0;
      return { month: key.split('-')[1], approved: data.approved, rejected: data.rejected, rate };
    });
    setApprovalRateData(rateData);
  };

  const calculatePendingApps = (members: any[]) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const pendingByDay = last7Days.map(date => {
      const count = members.filter(m => 
        m.approval_status === 'pending' && 
        m.created_at.startsWith(date)
      ).length;
      return { day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), pending: count };
    });
    setPendingAppsData(pendingByDay);
  };

  const calculateMetrics = (members: any[]) => {
    const approved = members.filter(m => m.approval_status === 'approved').length;
    const rejected = members.filter(m => m.approval_status === 'rejected').length;
    const pending = members.filter(m => m.approval_status === 'pending').length;
    const total = approved + rejected;

    const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;
    const rejectionRate = total > 0 ? Math.round((rejected / total) * 100) : 0;

    const approvedMembers = members.filter(m => m.approval_status === 'approved' && m.approved_at && m.created_at);
    const avgTime = approvedMembers.length > 0
      ? approvedMembers.reduce((sum, m) => {
          const diff = new Date(m.approved_at).getTime() - new Date(m.created_at).getTime();
          return sum + diff / (1000 * 60 * 60 * 24);
        }, 0) / approvedMembers.length
      : 0;

    setMetrics([
      { label: 'Approval Rate', value: `${approvalRate}%`, change: '+3.2%', icon: CheckCircle, color: 'text-green-600' },
      { label: 'Avg Approval Time', value: `${avgTime.toFixed(1)} days`, change: '-0.5 days', icon: Clock, color: 'text-blue-600' },
      { label: 'Pending Apps', value: pending.toString(), change: '-2', icon: TrendingUp, color: 'text-orange-600' },
      { label: 'Rejection Rate', value: `${rejectionRate}%`, change: '-3.2%', icon: XCircle, color: 'text-red-600' },
    ]);
  };

  if (loading) return <div className="flex justify-center p-12"><RefreshCw className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-6">
            <div className="flex items-center justify-between mb-2">
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
              <span className="text-sm font-medium text-gray-600">{metric.change}</span>
            </div>
            <p className="text-2xl font-bold">{metric.value}</p>
            <p className="text-sm text-gray-600">{metric.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Approval Rate Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={approvalRateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} name="Approval Rate %" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Pending Applications (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={pendingAppsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="pending" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
