import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

interface ABTestingComparisonProps {
  ads: any[];
}

export function ABTestingComparison({ ads }: ABTestingComparisonProps) {
  const [adA, setAdA] = useState(ads[0]?.id || '');
  const [adB, setAdB] = useState(ads[1]?.id || '');

  const selectedA = ads.find(a => a.id === adA);
  const selectedB = ads.find(a => a.id === adB);

  const comparisonData = [
    { metric: 'Impressions', [selectedA?.title || 'Ad A']: selectedA?.impressions || 0, [selectedB?.title || 'Ad B']: selectedB?.impressions || 0 },
    { metric: 'Clicks', [selectedA?.title || 'Ad A']: selectedA?.clicks || 0, [selectedB?.title || 'Ad B']: selectedB?.clicks || 0 },
    { metric: 'CTR (%)', [selectedA?.title || 'Ad A']: selectedA?.impressions ? (selectedA.clicks / selectedA.impressions * 100) : 0, [selectedB?.title || 'Ad B']: selectedB?.impressions ? (selectedB.clicks / selectedB.impressions * 100) : 0 }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">A/B Testing Comparison</h3>
      <div className="flex gap-4 mb-6">
        <Select value={adA} onValueChange={setAdA}>
          <SelectTrigger><SelectValue placeholder="Select Ad A" /></SelectTrigger>
          <SelectContent>{ads.map(ad => <SelectItem key={ad.id} value={ad.id}>{ad.title}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={adB} onValueChange={setAdB}>
          <SelectTrigger><SelectValue placeholder="Select Ad B" /></SelectTrigger>
          <SelectContent>{ads.map(ad => <SelectItem key={ad.id} value={ad.id}>{ad.title}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={comparisonData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="metric" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={selectedA?.title || 'Ad A'} fill="#3b82f6" />
          <Bar dataKey={selectedB?.title || 'Ad B'} fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
