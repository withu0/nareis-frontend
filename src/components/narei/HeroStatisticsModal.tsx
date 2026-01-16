import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, Users, BookOpen } from 'lucide-react';

interface HeroStatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'members' | 'resources' | 'events' | null;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const HeroStatisticsModal: React.FC<HeroStatisticsModalProps> = ({ isOpen, onClose, type }) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !type) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (type === 'members') {
          const { data: profiles, error } = await supabase
            .from('profiles')
            .select('membership_tier')
            .eq('approval_status', 'approved');

          if (!error && profiles) {
            const tierCounts = profiles.reduce((acc: any, p) => {
              const tier = p.membership_tier || 'Basic';
              acc[tier] = (acc[tier] || 0) + 1;
              return acc;
            }, {});

            setData(Object.entries(tierCounts).map(([name, value]) => ({ name, value })));
          }
        } else if (type === 'resources') {
          const { data: resources, error } = await supabase
            .from('resources')
            .select('category');

          if (!error && resources) {
            const categoryCounts = resources.reduce((acc: any, r) => {
              const cat = r.category || 'Other';
              acc[cat] = (acc[cat] || 0) + 1;
              return acc;
            }, {});

            setData(Object.entries(categoryCounts).map(([name, value]) => ({ name, value })));
          }
        } else if (type === 'events') {
          const today = new Date().toISOString().split('T')[0];
          const { data: events, error } = await supabase
            .from('events')
            .select('*')
            .gte('date', today)
            .order('date', { ascending: true })
            .limit(5);

          if (!error) setData(events || []);
        }
      } catch (err) {
        console.error('Error fetching modal data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isOpen, type]);

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton className="h-64 w-full" />;
    }

    if (!data || data.length === 0) {
      return <div className="text-center py-8 text-gray-500">No data available</div>;
    }

    if (type === 'members') {
      return (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">Membership Tier Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (type === 'resources') {
      return (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">Resource Category Breakdown</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (type === 'events') {
      return (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">Upcoming Events Timeline</h3>
          </div>
          <div className="space-y-4">
            {data.map((event: any) => (
              <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="font-semibold">{event.title}</div>
                <div className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</div>
                <div className="text-sm text-gray-500">{event.location}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {type === 'members' && 'Active Members Details'}
            {type === 'resources' && 'Resources Details'}
            {type === 'events' && 'Upcoming Events Details'}
          </DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default HeroStatisticsModal;
