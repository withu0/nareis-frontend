import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Activity, MessageSquare } from 'lucide-react';

const engagementData = [
  { month: 'Jan', logins: 450, posts: 120, events: 45, resources: 230 },
  { month: 'Feb', logins: 520, posts: 145, events: 52, resources: 280 },
  { month: 'Mar', logins: 580, posts: 168, events: 61, resources: 320 },
  { month: 'Apr', logins: 640, posts: 195, events: 68, resources: 365 },
  { month: 'May', logins: 720, posts: 220, events: 75, resources: 410 },
  { month: 'Jun', logins: 780, posts: 245, events: 82, resources: 455 },
];

export function EngagementMetrics() {
  const metrics = [
    { title: 'Active Members', value: '1,284', change: '+12.5%', icon: Users, color: 'text-blue-600' },
    { title: 'Avg. Session Time', value: '18m 32s', change: '+8.2%', icon: Activity, color: 'text-green-600' },
    { title: 'Forum Posts', value: '245', change: '+15.3%', icon: MessageSquare, color: 'text-purple-600' },
    { title: 'Engagement Score', value: '87.3', change: '+5.1%', icon: TrendingUp, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold mt-1">{metric.value}</p>
                  <p className="text-sm text-green-600 mt-1">{metric.change}</p>
                </div>
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Member Engagement Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="logins" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="posts" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="events" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
