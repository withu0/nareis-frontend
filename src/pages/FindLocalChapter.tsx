import React, { useState } from 'react';
import { BackButton } from '@/components/ui/back-button';

import { MapPin, Search, Phone, Mail, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Chapter {
  id: number;
  name: string;
  city: string;
  state: string;
  contact: string;
  email: string;
  website: string;
  lat: number;
  lng: number;
}

const FindLocalChapter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const chapters: Chapter[] = [
    { id: 1, name: 'Atlanta REIA', city: 'Atlanta', state: 'GA', contact: '(404) 555-0100', email: 'info@atlantareia.org', website: 'atlantareia.org', lat: 33.7490, lng: -84.3880 },
    { id: 2, name: 'Phoenix Real Estate Investors', city: 'Phoenix', state: 'AZ', contact: '(602) 555-0200', email: 'contact@phoenixrei.org', website: 'phoenixrei.org', lat: 33.4484, lng: -112.0740 },
    { id: 3, name: 'Dallas Fort Worth REIA', city: 'Dallas', state: 'TX', contact: '(214) 555-0300', email: 'info@dfwreia.com', website: 'dfwreia.com', lat: 32.7767, lng: -96.7970 },
    { id: 4, name: 'Miami Real Estate Club', city: 'Miami', state: 'FL', contact: '(305) 555-0400', email: 'hello@miamirei.org', website: 'miamirei.org', lat: 25.7617, lng: -80.1918 },
    { id: 5, name: 'Chicago REIA', city: 'Chicago', state: 'IL', contact: '(312) 555-0500', email: 'info@chicagoreia.org', website: 'chicagoreia.org', lat: 41.8781, lng: -87.6298 },
    { id: 6, name: 'Seattle Investors Association', city: 'Seattle', state: 'WA', contact: '(206) 555-0600', email: 'contact@seattlereia.org', website: 'seattlereia.org', lat: 47.6062, lng: -122.3321 }
  ];

  const filteredChapters = chapters.filter(chapter => 
    (searchTerm === '' || chapter.city.toLowerCase().includes(searchTerm.toLowerCase()) || 
     chapter.state.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedState === '' || chapter.state === selectedState)
  );

  const states = [...new Set(chapters.map(c => c.state))].sort();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Find a Local Chapter</h1>
          <p className="text-xl text-blue-100">Connect with real estate investors in your area</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                type="text"
                placeholder="Search by city or state..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All States</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChapters.map(chapter => (
            <Card key={chapter.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start mb-4">
                <MapPin className="w-6 h-6 text-blue-900 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold">{chapter.name}</h3>
                  <p className="text-gray-600">{chapter.city}, {chapter.state}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{chapter.contact}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{chapter.email}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-gray-500" />
                  <a href={`https://${chapter.website}`} className="text-blue-600 hover:underline">{chapter.website}</a>
                </div>
              </div>
              <Button className="w-full mt-4">Join This Chapter</Button>
            </Card>
          ))}
        </div>

        {filteredChapters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No chapters found. Try adjusting your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindLocalChapter;
