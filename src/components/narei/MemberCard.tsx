import React from 'react';
import { MapPin, Building2, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface MemberCardProps {
  name: string;
  title: string;
  location: string;
  specialty: string;
  image: string;
}

const MemberCard: React.FC<MemberCardProps> = ({ name, title, location, specialty, image }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleConnect = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    alert(`Connecting with ${name}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center hover:-translate-y-1">
      <img
        src={image}
        alt={name}
        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-amber-400"
      />
      <h3 className="text-lg font-bold text-gray-900 mb-1">{name}</h3>
      <p className="text-sm text-gray-600 mb-3">{title}</p>
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
          <MapPin className="w-3 h-3" />
          {location}
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-blue-900 font-semibold">
          <Building2 className="w-3 h-3" />
          {specialty}
        </div>
      </div>
      <button
        onClick={handleConnect}
        className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
      >
        <Mail className="w-4 h-4" />
        Connect
      </button>
    </div>
  );
};

export default MemberCard;
