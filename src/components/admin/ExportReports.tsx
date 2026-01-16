import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, FileText, Table, FileSpreadsheet, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function ExportReports() {
  const [exporting, setExporting] = useState<string | null>(null);

  const exportToCSV = async (reportType: string) => {
    setExporting(reportType);
    try {
      const csvData = await generateCSVData(reportType);
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success(`${reportType} report exported successfully`);
    } catch (error) {
      toast.error('Failed to export report');
    } finally {
      setExporting(null);
    }
  };

  const generateCSVData = async (reportType: string) => {
    switch (reportType) {
      case 'members': {
        const { data } = await supabase
          .from('customers')
          .select('first_name, last_name, email, membership_tier, approval_status, created_at')
          .eq('approval_status', 'approved');
        
        let csv = 'Name,Email,Tier,Status,Join Date\n';
        data?.forEach(m => {
          csv += `"${m.first_name} ${m.last_name}","${m.email}","${m.membership_tier}","${m.approval_status}","${new Date(m.created_at).toLocaleDateString()}"\n`;
        });
        return csv;
      }
      case 'revenue': {
        const { data } = await supabase
          .from('customers')
          .select('membership_tier, created_at')
          .eq('approval_status', 'approved');
        
        const tierPrices: any = { basic: 99, professional: 299, corporate: 999, enterprise: 2499 };
        const monthlyRevenue: any = {};
        
        data?.forEach(m => {
          const month = new Date(m.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
          monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (tierPrices[m.membership_tier] || 0);
        });

        let csv = 'Month,Revenue\n';
        Object.entries(monthlyRevenue).forEach(([month, revenue]) => {
          csv += `"${month}","$${revenue}"\n`;
        });
        return csv;
      }
      case 'approvals': {
        const { data } = await supabase
          .from('customers')
          .select('approval_status, approved_at, rejected_at, created_at');
        
        let csv = 'Date,Status,Days to Decision\n';
        data?.forEach(m => {
          const decisionDate = m.approved_at || m.rejected_at;
          const days = decisionDate 
            ? Math.round((new Date(decisionDate).getTime() - new Date(m.created_at).getTime()) / (1000 * 60 * 60 * 24))
            : 'Pending';
          csv += `"${new Date(m.created_at).toLocaleDateString()}","${m.approval_status}","${days}"\n`;
        });
        return csv;
      }
      case 'growth': {
        const { data } = await supabase
          .from('customers')
          .select('created_at, approval_status')
          .eq('approval_status', 'approved');
        
        const monthlyGrowth: any = {};
        data?.forEach(m => {
          const month = new Date(m.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
          monthlyGrowth[month] = (monthlyGrowth[month] || 0) + 1;
        });

        let csv = 'Month,New Members\n';
        Object.entries(monthlyGrowth).forEach(([month, count]) => {
          csv += `"${month}","${count}"\n`;
        });
        return csv;
      }
      default:
        return 'Report Data';
    }
  };

  const reports = [
    { name: 'Member Directory', type: 'members', icon: Table, description: 'Complete member list with details' },
    { name: 'Revenue Report', type: 'revenue', icon: FileSpreadsheet, description: 'Revenue breakdown and projections' },
    { name: 'Approval Analytics', type: 'approvals', icon: FileText, description: 'Application approval statistics' },
    { name: 'Growth Metrics', type: 'growth', icon: Download, description: 'Membership growth trends' },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Export Reports</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <div key={report.type} className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <report.icon className="h-5 w-5 text-blue-600" />
              <Button 
                size="sm" 
                onClick={() => exportToCSV(report.type)}
                disabled={exporting === report.type}
              >
                {exporting === report.type ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-1" />
                )}
                Export
              </Button>
            </div>
            <h4 className="font-medium mb-1">{report.name}</h4>
            <p className="text-sm text-gray-600">{report.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
