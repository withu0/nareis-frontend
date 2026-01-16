import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, TrendingUp, Clock } from 'lucide-react';

const updates = [
  { id: 1, title: 'H.R. 2847 - Real Estate Investment Tax Relief Act', status: 'Active', priority: 'High', date: '2025-10-15', description: 'Proposes tax deductions for property maintenance and improvements.', impact: 'Positive' },
  { id: 2, title: 'S.B. 1523 - Tenant Protection Enhancement', status: 'Committee', priority: 'Medium', date: '2025-10-10', description: 'Increases tenant rights and landlord obligations.', impact: 'Negative' },
  { id: 3, title: 'H.R. 3921 - Investment Property Depreciation Reform', status: 'Passed House', priority: 'High', date: '2025-10-08', description: 'Extends depreciation schedules for rental properties.', impact: 'Positive' },
  { id: 4, title: 'S.B. 2104 - Short-Term Rental Regulation Act', status: 'Active', priority: 'High', date: '2025-10-05', description: 'Federal guidelines for short-term rental operations.', impact: 'Neutral' },
];

export const LegislativeUpdates: React.FC = () => {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? updates : updates.filter(u => u.priority === filter);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Legislative Updates</h2>
        <div className="flex gap-2">
          {['All', 'High', 'Medium'].map(f => (
            <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)}>{f}</Button>
          ))}
        </div>
      </div>
      <div className="grid gap-4">
        {filtered.map(update => (
          <Card key={update.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold">{update.title}</h3>
                  <Badge variant={update.impact === 'Positive' ? 'default' : update.impact === 'Negative' ? 'destructive' : 'secondary'}>
                    {update.impact}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-3">{update.description}</p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{update.date}</span>
                  <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4" />{update.status}</span>
                </div>
              </div>
              <Badge variant={update.priority === 'High' ? 'destructive' : 'secondary'}>{update.priority}</Badge>
            </div>
            <Button variant="outline" size="sm">Read Full Bill</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
