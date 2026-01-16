import { useState } from "react";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";

import { Download, FileText } from "lucide-react";
import { MemberEngagementOverview } from "@/components/analytics/MemberEngagementOverview";
import { ResourceDownloadMetrics } from "@/components/analytics/ResourceDownloadMetrics";
import { EventsAttendedMetrics } from "@/components/analytics/EventsAttendedMetrics";
import { ForumParticipationMetrics } from "@/components/analytics/ForumParticipationMetrics";
import { CertificationProgress } from "@/components/certification/CertificationProgress";
import { ReferralStatsCard } from "@/components/referral/ReferralStatsCard";
import { ROIMetricsCard } from "@/components/dashboard/ROIMetricsCard";
import { useToast } from "@/hooks/use-toast";

export default function MemberAnalytics() {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      toast({
        title: "Report Generated",
        description: "Your activity report has been downloaded successfully.",
      });
      setIsExporting(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-4xl font-bold mb-2">My Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your engagement and membership value</p>
        </div>
        <Button onClick={handleExportReport} disabled={isExporting}>
          {isExporting ? (
            <>Generating...</>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </>
          )}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <MemberEngagementOverview />
        <ResourceDownloadMetrics />
        <EventsAttendedMetrics />
        <ForumParticipationMetrics />
        <CertificationProgress />
        <ReferralStatsCard />
        <ROIMetricsCard />
      </div>
    </div>
  );
}
