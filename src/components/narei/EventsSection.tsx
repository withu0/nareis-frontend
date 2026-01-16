import React, { useState } from 'react';
import EventCard from './EventCard';
import { events } from '@/data/nareiData';

const EventsSection: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const types = ['All', 'Conference', 'Webinar', 'Workshop', 'Advocacy'];

  const filteredEvents = filter === 'All' 
    ? events 
    : events.filter(event => event.type === filter);

  return (
    <section id="events" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          <p className="text-xl text-gray-600">Connect, learn, and grow with industry leaders</p>
        </div>

        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {types.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                filter === type
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEvents.map((event, idx) => (
              <EventCard key={idx} {...event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-2">No {filter.toLowerCase()} events scheduled at this time.</p>
            <p className="text-gray-500">Check back frequently for new events and opportunities!</p>
          </div>
        )}

      </div>
    </section>
  );
};

export default EventsSection;
