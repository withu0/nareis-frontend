import { Member } from '@/types/member';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, Calendar, Award } from 'lucide-react';

interface Props {
  member: Member;
}

const tierColors: Record<string, string> = {
  'founding-lifetime': 'bg-amber-500 text-white',
  'enterprise': 'bg-purple-600 text-white',
  'professional': 'bg-blue-600 text-white',
  'growth': 'bg-green-600 text-white',
  'foundation': 'bg-gray-600 text-white',
  'service-partner': 'bg-teal-600 text-white'
};

const tierLabels: Record<string, string> = {
  'founding-lifetime': 'Founding Lifetime',
  'enterprise': 'Enterprise',
  'professional': 'Professional',
  'growth': 'Growth',
  'foundation': 'Foundation',
  'service-partner': 'Service Partner'
};

export function MemberProfileHeader({ member }: Props) {
  const memberSince = new Date(member.joinedDate).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-xl p-8">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <img
          src={member.image}
          alt={member.name}
          className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
        />
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
            <h1 className="text-3xl font-bold">{member.name}</h1>
            <Badge className={tierColors[member.membershipTier]}>
              <Award className="w-3 h-3 mr-1" />
              {tierLabels[member.membershipTier]}
            </Badge>
          </div>
          <p className="text-xl text-blue-100 mb-4">{member.title}</p>
          <div className="flex flex-wrap gap-4 text-blue-100 justify-center md:justify-start">
            <span className="flex items-center gap-1">
              <Building2 className="w-4 h-4" /> {member.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {member.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Member since {memberSince}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
