import { Card } from '@/components/ui/card';
import { DollarSign, TrendingUp, MousePointer, Eye } from 'lucide-react';

interface ROICalculatorProps {
  totalSpent: number;
  totalImpressions: number;
  totalClicks: number;
  revenue?: number;
}

export function ROICalculator({ totalSpent, totalImpressions, totalClicks, revenue = 0 }: ROICalculatorProps) {
  const cpc = totalClicks > 0 ? totalSpent / totalClicks : 0;
  const cpm = totalImpressions > 0 ? (totalSpent / totalImpressions) * 1000 : 0;
  const roi = totalSpent > 0 ? ((revenue - totalSpent) / totalSpent) * 100 : 0;
  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">ROI & Cost Metrics</h3>
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MousePointer className="h-5 w-5 text-blue-600" />
            <p className="text-sm text-gray-600">Cost Per Click</p>
          </div>
          <p className="text-2xl font-bold text-blue-600">${cpc.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-5 w-5 text-green-600" />
            <p className="text-sm text-gray-600">Cost Per 1K Impressions</p>
          </div>
          <p className="text-2xl font-bold text-green-600">${cpm.toFixed(2)}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <p className="text-sm text-gray-600">Click-Through Rate</p>
          </div>
          <p className="text-2xl font-bold text-purple-600">{ctr.toFixed(2)}%</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-orange-600" />
            <p className="text-sm text-gray-600">ROI</p>
          </div>
          <p className="text-2xl font-bold text-orange-600">{roi.toFixed(1)}%</p>
        </div>
      </div>
    </Card>
  );
}
