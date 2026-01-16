import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, MapPin } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const mockData = [
  { month: "Jan", events: 2 },
  { month: "Feb", events: 3 },
  { month: "Mar", events: 1 },
  { month: "Apr", events: 4 },
  { month: "May", events: 3 },
  { month: "Jun", events: 5 },
];

export function EventsAttendedMetrics() {
  const totalEvents = 18;
  const upcomingEvents = 3;
  const networkingConnections = 47;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Events Attended
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold">{totalEvents}</p>
            <p className="text-xs text-muted-foreground">Events Attended</p>
          </div>
          <div className="text-center">
            <MapPin className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold">{upcomingEvents}</p>
            <p className="text-xs text-muted-foreground">Registered</p>
          </div>
          <div className="text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold">{networkingConnections}</p>
            <p className="text-xs text-muted-foreground">Connections</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={mockData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="events" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
