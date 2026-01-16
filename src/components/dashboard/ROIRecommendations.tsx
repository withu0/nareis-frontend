import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Recommendation {
  title: string;
  description: string;
  action: string;
  link: string;
  potentialValue: string;
}

interface ROIRecommendationsProps {
  recommendations: Recommendation[];
}

export function ROIRecommendations({ recommendations }: ROIRecommendationsProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Personalized Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="border-l-4 border-primary pl-4 py-2">
              <h4 className="font-semibold text-sm">{rec.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-green-600 font-medium">
                  Potential Value: {rec.potentialValue}
                </span>
                <Button size="sm" variant="ghost" onClick={() => navigate(rec.link)}>
                  {rec.action} <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
