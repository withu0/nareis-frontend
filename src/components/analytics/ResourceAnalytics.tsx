import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Download, Eye, TrendingUp } from 'lucide-react';

const usageData = [
  { month: 'Jan', downloads: 345, views: 1240, shares: 89 },
  { month: 'Feb', downloads: 412, views: 1450, shares: 102 },
  { month: 'Mar', downloads: 478, views: 1680, shares: 118 },
  { month: 'Apr', downloads: 523, views: 1820, shares: 134 },
  { month: 'May', downloads: 589, views: 2050, shares: 145 },
  { month: 'Jun', downloads: 642, views: 2280, shares: 167 },
];

const topResources = [
  { title: 'Investment Guide 2025', downloads: 342, category: 'Education' },
  { title: 'Market Analysis Q2', downloads: 298, category: 'Research' },
  { title: 'Best Practices Handbook', downloads: 276, category: 'Training' },
  { title: 'Legal Compliance Guide', downloads: 234, category: 'Legal' },
  { title: 'Networking Strategies', downloads: 212, category: 'Networking' },
];

export function ResourceAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Resources</p>
                <p className="text-2xl font-bold mt-1">487</p>
                <p className="text-sm text-green-600 mt-1">+23 new</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Downloads</p>
                <p className="text-2xl font-bold mt-1">3,389</p>
                <p className="text-sm text-green-600 mt-1">+18.9%</p>
              </div>
              <Download className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold mt-1">10,520</p>
                <p className="text-sm text-green-600 mt-1">+21.4%</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold mt-1">32.2%</p>
                <p className="text-sm text-green-600 mt-1">+4.7%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resource Usage Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="downloads" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="shares" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Resources by Downloads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topResources.map((resource, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{resource.title}</p>
                  <p className="text-sm text-gray-600">{resource.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{resource.downloads}</p>
                  <p className="text-xs text-gray-600">downloads</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
