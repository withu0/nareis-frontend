import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import LearningPathCard from './LearningPathCard';
import { getBehavior } from '@/lib/behaviorTracking';

export default function PersonalizedLearningPaths() {
  const behavior = getBehavior();
  
  const paths = [
    {
      title: 'Real Estate Investment Fundamentals',
      description: 'Master the basics of real estate investing',
      progress: 40,
      modules: [
        { id: '1', title: 'Introduction to REITs', completed: true, locked: false, link: '/video-library' },
        { id: '2', title: 'Market Analysis Basics', completed: true, locked: false, link: '/resources' },
        { id: '3', title: 'Financial Modeling', completed: false, locked: false, link: '/resources' },
        { id: '4', title: 'Risk Assessment', completed: false, locked: false, link: '/video-library' },
        { id: '5', title: 'Portfolio Strategy', completed: false, locked: true, link: '/resources' }
      ]
    },
    {
      title: 'Leadership & Networking',
      description: 'Build your professional network and leadership skills',
      progress: 60,
      modules: [
        { id: '1', title: 'Effective Networking', completed: true, locked: false, link: '/events' },
        { id: '2', title: 'Public Speaking', completed: true, locked: false, link: '/video-library' },
        { id: '3', title: 'Team Building', completed: true, locked: false, link: '/resources' },
        { id: '4', title: 'Mentorship Programs', completed: false, locked: false, link: '/member-directory' },
        { id: '5', title: 'Chapter Leadership', completed: false, locked: true, link: '/find-local-chapter' }
      ]
    },
    {
      title: 'Industry Trends & Innovation',
      description: 'Stay ahead with latest market insights',
      progress: 20,
      modules: [
        { id: '1', title: 'Market Trends 2025', completed: true, locked: false, link: '/resources' },
        { id: '2', title: 'Technology in Real Estate', completed: false, locked: false, link: '/video-library' },
        { id: '3', title: 'Sustainability Practices', completed: false, locked: false, link: '/resources' },
        { id: '4', title: 'Future of REITs', completed: false, locked: true, link: '/video-library' }
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-blue-600" />
          Your Learning Paths
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Personalized courses based on your membership tier and interests
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map((path, idx) => (
            <LearningPathCard key={idx} {...path} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
