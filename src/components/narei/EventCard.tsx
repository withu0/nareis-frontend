import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  type: string;
  attendees: number;
  image: string;
  registrationUrl?: string;
}

const EventCard: React.FC<EventCardProps> = ({ title, date, location, type, attendees, image, registrationUrl }) => {
  const handleRegister = () => {
    if (registrationUrl) {
      window.open(registrationUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert(`Registration information coming soon for: ${title}`);
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-5">
        <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-3 py-1 rounded-full">
          {type}
        </span>
        <h3 className="text-lg font-bold text-gray-900 mt-3 mb-3">{title}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            {date}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            {location}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            {attendees} registered
          </div>
        </div>
        <button
          onClick={handleRegister}
          className="w-full bg-amber-500 text-white font-semibold py-2 rounded-lg hover:bg-amber-600 transition-colors"
        >
          Register Now
        </button>
      </div>
    </div>
  );
};

export default EventCard;
