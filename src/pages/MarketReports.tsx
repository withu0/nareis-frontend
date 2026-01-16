import React, { useState } from 'react';
import { BackButton } from '@/components/ui/back-button';
import { Navigation } from '@/components/narei/Navigation';

import Footer from '@/components/narei/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search, TrendingUp, BarChart3, FileText } from 'lucide-react';

const MarketReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const reports = [
    { id: 1, title: 'Q4 2024 Market Analysis', type: 'Quarterly', date: '2024-12-15', downloads: 234 },
    { id: 2, title: 'Annual Industry Trends 2024', type: 'Annual', date: '2024-11-01', downloads: 567 },
    { id: 3, title: 'Regional Market Overview', type: 'Regional', date: '2024-10-20', downloads: 189 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <main className="flex-1">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-4xl font-bold mb-4">Market Reports</h1>
            <p className="text-xl">Access comprehensive industry analysis and market insights</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <BackButton />

          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <Input placeholder="Search reports..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
                <SelectItem value="regional">Regional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <FileText className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <span>{report.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>Type: {report.type}</p>
                    <p>Date: {report.date}</p>
                    <p>Downloads: {report.downloads}</p>
                  </div>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MarketReports;
