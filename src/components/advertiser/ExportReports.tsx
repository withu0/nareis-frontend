import { Button } from '@/components/ui/button';
import { Download, FileText, Table } from 'lucide-react';
import { toast } from 'sonner';

interface ExportReportsProps {
  data: any[];
  filename: string;
}

export function ExportReports({ data, filename }: ExportReportsProps) {
  const exportToCSV = () => {
    if (!data.length) {
      toast.error('No data to export');
      return;
    }
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    toast.success('CSV exported successfully');
  };

  const exportToPDF = () => {
    toast.info('PDF export coming soon - use CSV for now');
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={exportToCSV}>
        <Table className="h-4 w-4 mr-2" />
        Export CSV
      </Button>
      <Button variant="outline" onClick={exportToPDF}>
        <FileText className="h-4 w-4 mr-2" />
        Export PDF
      </Button>
    </div>
  );
}
