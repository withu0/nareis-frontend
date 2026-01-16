import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GeographicPerformanceProps {
  data: Array<{ location: string; impressions: number; clicks: number; ctr: number }>;
}

export function GeographicPerformance({ data }: GeographicPerformanceProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Geographic Performance</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="location" type="category" width={100} />
          <Tooltip />
          <Legend />
          <Bar dataKey="impressions" fill="#3b82f6" />
          <Bar dataKey="clicks" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.slice(0, 4).map((loc) => (
          <div key={loc.location} className="text-center">
            <p className="text-sm text-gray-600">{loc.location}</p>
            <p className="text-lg font-semibold">{loc.ctr.toFixed(2)}% CTR</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
