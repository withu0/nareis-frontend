import { Card } from '@/components/ui/card';
import { Users, Calendar, BookOpen, MessageSquare, Award, TrendingUp } from 'lucide-react';

interface TourStepProps {
  data: any;
}

const features = [
  {
    icon: Users,
    title: 'Member Directory',
    description: 'Connect with thousands of real estate investors, developers, and industry professionals.',
    link: '/member-directory'
  },
  {
    icon: Calendar,
    title: 'Events & Networking',
    description: 'Attend conferences, webinars, and local chapter meetings to grow your network.',
    link: '/events'
  },
  {
    icon: BookOpen,
    title: 'Resources & Education',
    description: 'Access exclusive guides, templates, market reports, and educational content.',
    link: '/resources'
  },
  {
    icon: MessageSquare,
    title: 'Community Forums',
    description: 'Discuss deals, ask questions, and share insights with fellow members.',
    link: '/forums'
  },
  {
    icon: Award,
    title: 'Member Benefits',
    description: 'Unlock discounts, tools, and exclusive perks designed for real estate investors.',
    link: '/member-benefits'
  },
  {
    icon: TrendingUp,
    title: 'Industry Advocacy',
    description: 'Stay informed on legislation and help shape policies affecting real estate.',
    link: '/advocacy'
  }
];

export default function TourStep({ data }: TourStepProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold">Welcome to NAREIS!</h3>
        <p className="text-gray-600 mt-2">Here's what you can do as a member</p>
      </div>
      <div className="grid gap-4">
        {features.map((feature, idx) => (
          <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <feature.icon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{feature.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
