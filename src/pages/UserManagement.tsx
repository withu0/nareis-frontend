import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Briefcase, TrendingUp, Database, HardDrive } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import MemberManagement from '@/components/admin/MemberManagement';
import { adminAPI } from '@/lib/api';

export default function UserManagement() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeMembers, setActiveMembers] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [fromDatabase, setFromDatabase] = useState(false);

  useEffect(() => { 
    fetchStats();
  }, []);

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

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-blue-600' },
    { label: 'Active Members', value: activeMembers, icon: Briefcase, color: 'text-green-600' },
    { label: 'Pending Approval', value: pendingCount, icon: Users, color: 'text-orange-600' },
    { label: 'Growth Rate', value: '+23.5%', icon: TrendingUp, color: 'text-green-600' },
  ];

  return (
    <AdminLayout stats={{ pendingCount }}>
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* User Management */}
        <MemberManagement />
      </div>
    </AdminLayout>
  );
}
