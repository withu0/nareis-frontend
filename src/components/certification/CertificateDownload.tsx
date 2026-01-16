import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Award, Share2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CertificateDownloadProps {
  certificateNumber: string;
  certificationDate: string;
}

export function CertificateDownload({ certificateNumber, certificationDate }: CertificateDownloadProps) {
  const { user } = useAuth();

  const handleDownloadCertificate = () => {
    // In production, this would generate a PDF certificate
    alert('Certificate download will be available soon!');
  };

  const handleDownloadBadge = () => {
    // In production, this would download a badge image
    alert('Badge download will be available soon!');
  };

  const handleShare = () => {
    const url = `${window.location.origin}/verify-certification?id=${certificateNumber}`;
    navigator.clipboard.writeText(url);
    alert('Verification link copied to clipboard!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Your Credentials
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="text-center space-y-2">
            <Award className="h-12 w-12 mx-auto" />
            <h3 className="font-bold text-xl">NAREIS Certified Professional</h3>
            <p className="text-sm opacity-90">{user?.email}</p>
            <p className="text-xs opacity-75">Certificate #{certificateNumber}</p>
            <p className="text-xs opacity-75">Issued: {new Date(certificationDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Button onClick={handleDownloadCertificate} variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Certificate
          </Button>
          <Button onClick={handleDownloadBadge} variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Badge
          </Button>
          <Button onClick={handleShare} variant="outline" className="w-full">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
