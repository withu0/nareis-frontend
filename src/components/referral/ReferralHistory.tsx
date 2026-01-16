import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Referral {
  id: string;
  refereeEmail: string;
  refereeName?: string;
  status: string;
  pointsAwarded: number;
  createdAt: string;
}

const mockReferrals: Referral[] = [
  { id: '1', refereeEmail: 'john@example.com', refereeName: 'John Doe', status: 'completed', pointsAwarded: 25, createdAt: '2024-10-15' },
  { id: '2', refereeEmail: 'jane@example.com', refereeName: 'Jane Smith', status: 'completed', pointsAwarded: 25, createdAt: '2024-10-10' },
  { id: '3', refereeEmail: 'bob@example.com', status: 'pending', pointsAwarded: 0, createdAt: '2024-10-20' },
  { id: '4', refereeEmail: 'alice@example.com', refereeName: 'Alice Johnson', status: 'registered', pointsAwarded: 10, createdAt: '2024-10-18' },
];

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  registered: 'bg-blue-100 text-blue-800',
  expired: 'bg-gray-100 text-gray-800'
};

export function ReferralHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Referee</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockReferrals.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell>{referral.refereeName || 'Pending'}</TableCell>
                <TableCell>{referral.refereeEmail}</TableCell>
                <TableCell>
                  <Badge className={statusColors[referral.status]}>{referral.status}</Badge>
                </TableCell>
                <TableCell>{referral.pointsAwarded}</TableCell>
                <TableCell>{new Date(referral.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
