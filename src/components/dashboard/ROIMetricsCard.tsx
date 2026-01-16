import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ROIMetric {
  label: string;
  value: number;
  estimatedValue: string;
  change: number;
  icon: React.ReactNode;
}

interface ROIMetricsCardProps {
  metrics: ROIMetric[];
}

export function ROIMetricsCard({ metrics }: ROIMetricsCardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.label}
            </CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              Est. Value: {metric.estimatedValue}
            </p>
            <div className="flex items-center text-xs mt-1">
              {metric.change >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={metric.change >= 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(metric.change)}% vs last year
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
