import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Users, TrendingUp } from 'lucide-react';

const attendanceData = [
  { month: 'Jan', registered: 145, attended: 120, noShow: 25 },
  { month: 'Feb', registered: 168, attended: 142, noShow: 26 },
  { month: 'Mar', registered: 192, attended: 165, noShow: 27 },
  { month: 'Apr', registered: 215, attended: 188, noShow: 27 },
  { month: 'May', registered: 238, attended: 210, noShow: 28 },
  { month: 'Jun', registered: 265, attended: 235, noShow: 30 },
];

const eventTypeData = [
  { name: 'Networking', value: 35, color: '#3b82f6' },
  { name: 'Webinars', value: 28, color: '#8b5cf6' },
  { name: 'Workshops', value: 22, color: '#10b981' },
  { name: 'Conferences', value: 15, color: '#f59e0b' },
];

export function EventAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold mt-1">82</p>
                <p className="text-sm text-green-600 mt-1">+18.2%</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Attendance</p>
                <p className="text-2xl font-bold mt-1">177</p>
                <p className="text-sm text-green-600 mt-1">+12.4%</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold mt-1">88.6%</p>
                <p className="text-sm text-green-600 mt-1">+3.2%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="attended" fill="#10b981" />
                <Bar dataKey="noShow" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={eventTypeData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {eventTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
