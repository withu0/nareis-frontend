import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Award, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CustomBadgeGenerator from './CustomBadgeGenerator';
import { trackBadgeDownload } from '@/lib/badgeAnalytics';
import { useAuth } from '@/contexts/AuthContext';


interface MemberBadgeDownloadProps {
  membershipTier?: string;
  isPaidMember: boolean;
}

const badges = [
  {
    id: 'square',
    name: 'Square Badge',
    description: 'Perfect for social media profiles',
    format: '1:1 (1000x1000px)',
    url: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1763735123695_606e0bec.webp',
    uses: ['LinkedIn', 'Facebook', 'Instagram', 'Twitter']
  },
  {
    id: 'banner',
    name: 'Horizontal Banner',
    description: 'Great for website footers and email signatures',
    format: '16:9 (1920x1080px)',
    url: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1763735124623_c05d25f4.webp',
    uses: ['Website Footer', 'Email Signature', 'Presentations']
  },
  {
    id: 'social',
    name: 'Social Media Badge',
    description: 'Optimized for social sharing',
    format: '1:1 (1000x1000px)',
    url: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1763735125503_af2da208.webp',
    uses: ['Instagram Post', 'Facebook Post', 'LinkedIn Post']
  }
];

export function MemberBadgeDownload({ membershipTier, isPaidMember }: MemberBadgeDownloadProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDownload = async (badge: typeof badges[0]) => {
    if (!user) return;

    // Track the download
    await trackBadgeDownload({
      userId: user.id,
      badgeType: 'premade',
      badgeFormat: badge.id as 'social' | 'website' | 'print',
    });

    try {
      const response = await fetch(badge.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `narei-proud-member-${badge.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'Badge Downloaded',
        description: `${badge.name} has been downloaded successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Unable to download badge. Please try again.',
        variant: 'destructive',
      });
    }
  };


  if (!isPaidMember) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Proud Member Badges
          </CardTitle>
          <CardDescription>Available to paid members only</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Award className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Upgrade to a paid membership to access exclusive "Proud Member" badges for your website, social media, and print materials.
            </p>
            <Button>Upgrade Membership</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-6">
      {/* Custom Badge Generator */}
      <CustomBadgeGenerator membershipTier={membershipTier || 'Professional'} />

      {/* Pre-made Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Pre-Made Member Badges
          </CardTitle>
          <CardDescription>
            Download ready-to-use badges for quick implementation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-900">Active {membershipTier} Member</p>
              <p className="text-sm text-green-700">You have full access to all member badges and logos</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-1">
            {badges.map((badge) => (
              <div key={badge.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{badge.name}</h3>
                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Format: {badge.format}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                  <img 
                    src={badge.url} 
                    alt={badge.name}
                    className="max-h-32 w-auto object-contain"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Best for:</p>
                  <div className="flex flex-wrap gap-2">
                    {badge.uses.map((use) => (
                      <span key={use} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {use}
                      </span>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={() => handleDownload(badge)}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download {badge.name}
                </Button>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Usage Guidelines</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use badges only while your membership is active</li>
              <li>• Do not modify or alter the badge design</li>
              <li>• Ensure badges are clearly visible and not distorted</li>
              <li>• Link badges back to NAREI.org when possible</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>

  );
}
