import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Download, TrendingUp, Users, Palette } from 'lucide-react';
import { getBadgeAnalytics, subscribeToBadgeAnalytics, type BadgeAnalyticsRecord } from '@/lib/badgeAnalytics';
import { Badge } from '@/components/ui/badge';

interface BadgeStats {
  totalDownloads: number;
  uniqueUsers: number;
  customBadges: number;
  premadeBadges: number;
  colorSchemes: Record<string, number>;
  formats: Record<string, number>;
  recentDownloads: any[];
}

export default function BadgeAnalyticsDashboard() {
  const [stats, setStats] = useState<BadgeStats>({
    totalDownloads: 0,
    uniqueUsers: 0,
    customBadges: 0,
    premadeBadges: 0,
    colorSchemes: {},
    formats: {},
    recentDownloads: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();

    // Subscribe to real-time updates
    const subscription = subscribeToBadgeAnalytics(() => {
      loadAnalytics();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await getBadgeAnalytics();
      
      const uniqueUsers = new Set(data.map((d) => d.user_id)).size;
      const customBadges = data.filter((d) => d.badge_type === 'custom').length;
      const premadeBadges = data.filter((d) => d.badge_type === 'pre-made').length;
      
      const colorSchemes: Record<string, number> = {};
      const formats: Record<string, number> = {};
      
      data.forEach((d: any) => {
        if (d.color_scheme) {
          colorSchemes[d.color_scheme] = (colorSchemes[d.color_scheme] || 0) + 1;
        }
        if (d.badge_format) {
          formats[d.badge_format] = (formats[d.badge_format] || 0) + 1;
        }
      });

      setStats({
        totalDownloads: data.length,
        uniqueUsers,
        customBadges,
        premadeBadges,
        colorSchemes,
        formats,
        recentDownloads: data.slice(0, 10)
      });
    } catch (error) {
      console.error('Error loading badge analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const adoptionRate = stats.uniqueUsers > 0 
    ? ((stats.uniqueUsers / 100) * 100).toFixed(1) 
    : '0';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Badge Analytics</h2>
        <p className="text-muted-foreground">Monitor badge downloads and member engagement</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDownloads}</div>
            <p className="text-xs text-muted-foreground">All-time badge downloads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">Members using badges</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Custom Badges</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customBadges}</div>
            <p className="text-xs text-muted-foreground">Personalized downloads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Adoption Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adoptionRate}%</div>
            <p className="text-xs text-muted-foreground">Member engagement</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Popular Color Schemes</CardTitle>
            <CardDescription>Most downloaded badge colors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.colorSchemes)
                .sort(([, a], [, b]) => b - a)
                .map(([scheme, count]) => (
                  <div key={scheme} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{scheme.replace('-', ' & ')}</span>
                    <Badge variant="secondary">{count} downloads</Badge>
                  </div>
                ))}
              {Object.keys(stats.colorSchemes).length === 0 && (
                <p className="text-sm text-muted-foreground">No data available yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Badge Formats</CardTitle>
            <CardDescription>Download distribution by format</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.formats)
                .sort(([, a], [, b]) => b - a)
                .map(([format, count]) => (
                  <div key={format} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{format}</span>
                    <Badge variant="secondary">{count} downloads</Badge>
                  </div>
                ))}
              {Object.keys(stats.formats).length === 0 && (
                <p className="text-sm text-muted-foreground">No data available yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
