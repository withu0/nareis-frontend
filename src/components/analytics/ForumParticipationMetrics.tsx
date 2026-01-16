import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ThumbsUp, Award } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const mockData = [
  { month: "Jan", posts: 5, replies: 12 },
  { month: "Feb", posts: 8, replies: 18 },
  { month: "Mar", posts: 6, replies: 15 },
  { month: "Apr", posts: 10, replies: 22 },
  { month: "May", posts: 12, replies: 28 },
  { month: "Jun", posts: 9, replies: 20 },
];

export function ForumParticipationMetrics() {
  const totalPosts = 50;
  const totalReplies = 115;
  const likesReceived = 234;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Forum Participation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <MessageSquare className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold">{totalPosts}</p>
            <p className="text-xs text-muted-foreground">Posts Created</p>
          </div>
          <div className="text-center">
            <Award className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold">{totalReplies}</p>
            <p className="text-xs text-muted-foreground">Replies</p>
          </div>
          <div className="text-center">
            <ThumbsUp className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold">{likesReceived}</p>
            <p className="text-xs text-muted-foreground">Likes Received</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={mockData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="posts" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            <Area type="monotone" dataKey="replies" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
