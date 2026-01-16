import { useState } from 'react';
import { BackButton } from '@/components/ui/back-button';
import { Card } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Clock, Search } from 'lucide-react';

const jobs = [
  { id: 1, title: 'Senior Property Manager', company: 'Urban Realty', location: 'New York, NY', type: 'Full-time', salary: '$80k-$100k', posted: '2 days ago' },
  { id: 2, title: 'Real Estate Analyst', company: 'Metro Group', location: 'Chicago, IL', type: 'Full-time', salary: '$65k-$85k', posted: '1 week ago' },
  { id: 3, title: 'Development Coordinator', company: 'Green Build', location: 'San Francisco, CA', type: 'Contract', salary: '$70k-$90k', posted: '3 days ago' },
  { id: 4, title: 'Leasing Consultant', company: 'Apex Properties', location: 'Austin, TX', type: 'Full-time', salary: '$50k-$65k', posted: '5 days ago' },
  { id: 5, title: 'Asset Manager', company: 'Capital Ventures', location: 'Boston, MA', type: 'Full-time', salary: '$90k-$120k', posted: '1 day ago' },
  { id: 6, title: 'Construction Manager', company: 'BuildRight Inc', location: 'Denver, CO', type: 'Full-time', salary: '$85k-$110k', posted: '4 days ago' },
];

export default function JobBoard() {
  const [search, setSearch] = useState('');
  const filtered = jobs.filter(j => 
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <BackButton />
        <h1 className="text-4xl font-bold mb-8">Job Board</h1>


        
        <div className="mb-8 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((job) => (
            <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-3">{job.company}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" /> {job.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /> {job.posted}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="mb-3">{job.salary}</Badge>
                  <Button>Apply Now</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
