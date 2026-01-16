import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Award, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function MemberEngagementOverview() {
  const engagementScore = 87;
  const memberLevel = "Gold Member";
  const nextLevelProgress = 70;

  const achievements = [
    { name: "Active Participant", description: "Posted 50+ forum discussions", earned: true },
    { name: "Event Enthusiast", description: "Attended 10+ events", earned: true },
    { name: "Resource Expert", description: "Downloaded 50+ resources", earned: true },
    { name: "Networking Pro", description: "Connected with 50+ members", earned: false },
  ];

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Engagement Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <p className="text-5xl font-bold text-blue-600">{engagementScore}</p>
            <p className="text-sm text-muted-foreground mt-2">Engagement Score</p>
          </div>
          
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <p className="font-semibold">{memberLevel}</p>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Progress to Platinum</p>
            <Progress value={nextLevelProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{nextLevelProgress}% complete</p>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-green-600" />
              <p className="font-semibold">Achievements</p>
            </div>
            <div className="space-y-2">
              {achievements.map((achievement) => (
                <div key={achievement.name} className="flex items-start gap-2">
                  <div className={`w-2 h-2 rounded-full mt-1 ${achievement.earned ? 'bg-green-600' : 'bg-gray-300'}`} />
                  <div>
                    <p className="text-xs font-medium">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
