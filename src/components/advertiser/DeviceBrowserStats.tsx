import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

interface DeviceBrowserStatsProps {
  deviceData: Array<{ device: string; impressions: number; clicks: number }>;
  browserData: Array<{ browser: string; value: number }>;
}

export function DeviceBrowserStats({ deviceData, browserData }: DeviceBrowserStatsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Device Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={deviceData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="device" type="category" />
            <Tooltip />
            <Legend />
            <Bar dataKey="impressions" fill="#3b82f6" />
            <Bar dataKey="clicks" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Browser Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={browserData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label={({ browser, percent }) => `${browser}: ${(percent * 100).toFixed(0)}%`}>
              {browserData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
