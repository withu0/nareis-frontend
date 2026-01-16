import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, BookOpen, Calendar, Users } from 'lucide-react';
import { getBehavior } from '@/lib/behaviorTracking';
import { useNavigate } from 'react-router-dom';

export default function AIRecommendations() {
  const navigate = useNavigate();
  const behavior = getBehavior();
  
  const recommendations = generateRecommendations(behavior);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI-Powered Recommendations
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Personalized suggestions based on your activity
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
              {rec.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{rec.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
              <Button 
                size="sm" 
                variant="link" 
                className="px-0 h-auto mt-2"
                onClick={() => navigate(rec.link)}
              >
                {rec.action} →
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function generateRecommendations(behavior: any) {
  const recs = [];
  
  if (behavior.eventRegistrations.length < 3) {
    recs.push({
      title: 'Expand Your Network',
      description: 'Members who attend 5+ events make 3x more connections',
      action: 'Browse Events',
      link: '/events',
      icon: <Calendar className="h-4 w-4 text-blue-600" />
    });
  }
  
  if (behavior.resourceDownloads.length < 5) {
    recs.push({
      title: 'Unlock Premium Resources',
      description: 'Access exclusive templates and guides for your tier',
      action: 'View Resources',
      link: '/resources',
      icon: <BookOpen className="h-4 w-4 text-green-600" />
    });
  }
  
  if (behavior.forumPosts < 5) {
    recs.push({
      title: 'Join the Conversation',
      description: 'Active forum members report 50% more valuable connections',
      action: 'Visit Forums',
      link: '/forums',
      icon: <Users className="h-4 w-4 text-orange-600" />
    });
  }
  
  if (!behavior.pageViews['/member-directory']) {
    recs.push({
      title: 'Discover Members',
      description: 'Find mentors and peers in your industry',
      action: 'Explore Directory',
      link: '/member-directory',
      icon: <TrendingUp className="h-4 w-4 text-purple-600" />
    });
  }
  
  return recs.slice(0, 3);
}
