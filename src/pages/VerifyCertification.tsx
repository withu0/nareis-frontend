import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, CheckCircle2, XCircle, Award } from 'lucide-react';
import { toast } from 'sonner';

interface VerificationResult {
  valid: boolean;
  memberName?: string;
  certificateNumber?: string;
  issueDate?: string;
  expirationDate?: string;
  status?: string;
}

export default function VerifyCertification() {
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a certificate number');
      return;
    }

    setLoading(true);
    try {
      // Query certifications table
      const { data: certData, error: certError } = await supabase
        .from('certifications')
        .select('*')
        .eq('certificate_number', searchQuery.trim().toUpperCase())
        .eq('status', 'completed')
        .single();

      if (certError && certError.code !== 'PGRST116') {
        throw certError;
      }

      if (certData) {
        // Get user profile info
        const { data: userData, error: userError } = await supabase
          .from('customers')
          .select('first_name, last_name')
          .eq('user_id', certData.user_id)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          console.error('Error fetching user:', userError);
        }

        const now = new Date();
        const expiration = new Date(certData.expiration_date);
        const isExpired = expiration < now;

        setResult({
          valid: !isExpired,
          memberName: userData ? `${userData.first_name} ${userData.last_name}` : 'NAREIS Member',
          certificateNumber: certData.certificate_number,
          issueDate: certData.certification_date,
          expirationDate: certData.expiration_date,
          status: isExpired ? 'Expired' : 'Active'
        });
      } else {
        setResult({ valid: false });
      }
    } catch (error) {
      console.error('Error verifying certification:', error);
      toast.error('Failed to verify certification');
      setResult({ valid: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <Award className="h-16 w-16 mx-auto mb-4 text-primary" />
        <h1 className="text-4xl font-bold mb-4">Verify NAREIS Certification</h1>
        <p className="text-lg text-muted-foreground">
          Enter a certificate number to verify certification status
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Verification Search</CardTitle>
          <CardDescription>Search by certificate number (e.g., NAREI-123456)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter certificate number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            />
            <Button onClick={handleVerify} disabled={!searchQuery || loading}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className={result.valid ? 'border-green-500' : 'border-red-500'}>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              {result.valid ? (
                <>
                  <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Valid Certification</h2>
                    <Badge className="bg-green-600 mb-4">Verified</Badge>
                  </div>
                  <div className="bg-muted rounded-lg p-6 text-left space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Member Name</p>
                        <p className="font-semibold">{result.memberName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Certificate Number</p>
                        <p className="font-mono font-semibold">{result.certificateNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Issue Date</p>
                        <p className="font-semibold">{new Date(result.issueDate!).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Expiration Date</p>
                        <p className="font-semibold">{new Date(result.expirationDate!).toLocaleDateString()}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge className="bg-green-600">{result.status}</Badge>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-16 w-16 text-red-600 mx-auto" />
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Certification Not Found</h2>
                    <p className="text-muted-foreground">
                      No valid certification found for the provided certificate number
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
