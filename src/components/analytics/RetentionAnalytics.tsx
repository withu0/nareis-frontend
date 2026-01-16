import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingDown, TrendingUp, Users, AlertTriangle } from 'lucide-react';

const retentionData = [
  { month: 'Jan', retained: 92, churned: 8, newMembers: 45 },
  { month: 'Feb', retained: 91, churned: 9, newMembers: 52 },
  { month: 'Mar', retained: 93, churned: 7, newMembers: 58 },
  { month: 'Apr', retained: 94, churned: 6, newMembers: 61 },
  { month: 'May', retained: 95, churned: 5, newMembers: 68 },
  { month: 'Jun', retained: 96, churned: 4, newMembers: 75 },
];

const cohortData = [
  { cohort: 'Jan 2025', month1: 100, month2: 94, month3: 89, month4: 85, month5: 82, month6: 80 },
  { cohort: 'Feb 2025', month1: 100, month2: 95, month3: 91, month4: 87, month5: 84, month6: 82 },
  { cohort: 'Mar 2025', month1: 100, month2: 96, month3: 92, month4: 89, month5: 86, month6: 84 },
  { cohort: 'Apr 2025', month1: 100, month2: 97, month3: 94, month4: 91, month5: 88, month6: 86 },
];

export function RetentionAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Retention Rate</p>
                <p className="text-2xl font-bold mt-1">96.2%</p>
                <p className="text-sm text-green-600 mt-1">+1.8%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Churn Rate</p>
                <p className="text-2xl font-bold mt-1">3.8%</p>
                <p className="text-sm text-red-600 mt-1">-1.8%</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">At-Risk Members</p>
                <p className="text-2xl font-bold mt-1">47</p>
                <p className="text-sm text-orange-600 mt-1">Needs attention</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New Members</p>
                <p className="text-2xl font-bold mt-1">75</p>
                <p className="text-sm text-green-600 mt-1">+10.3%</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Retention vs Churn Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="retained" stackId="1" stroke="#10b981" fill="#10b981" />
              <Area type="monotone" dataKey="churned" stackId="1" stroke="#ef4444" fill="#ef4444" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cohort Retention Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cohortData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cohort" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="month6" stroke="#3b82f6" strokeWidth={2} name="6-Month Retention" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
