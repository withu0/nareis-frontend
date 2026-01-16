import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Video, File } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

const mockData = [
  { month: "Jan", guides: 5, templates: 3, videos: 2 },
  { month: "Feb", guides: 8, templates: 5, videos: 4 },
  { month: "Mar", guides: 6, templates: 4, videos: 3 },
  { month: "Apr", guides: 10, templates: 7, videos: 5 },
  { month: "May", guides: 12, templates: 8, videos: 6 },
  { month: "Jun", guides: 9, templates: 6, videos: 4 },
];

export function ResourceDownloadMetrics() {
  const totalDownloads = 92;
  const categories = [
    { name: "Guides & Reports", count: 50, icon: FileText, color: "text-blue-600" },
    { name: "Templates", count: 33, icon: File, color: "text-green-600" },
    { name: "Videos", count: 24, icon: Video, color: "text-purple-600" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Resources Downloaded
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="text-3xl font-bold">{totalDownloads}</p>
          <p className="text-sm text-muted-foreground">Total downloads this year</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          {categories.map((cat) => (
            <div key={cat.name} className="text-center">
              <cat.icon className={`h-6 w-6 mx-auto mb-2 ${cat.color}`} />
              <p className="text-2xl font-bold">{cat.count}</p>
              <p className="text-xs text-muted-foreground">{cat.name}</p>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={mockData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="guides" fill="#3b82f6" name="Guides" />
            <Bar dataKey="templates" fill="#10b981" name="Templates" />
            <Bar dataKey="videos" fill="#a855f7" name="Videos" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
