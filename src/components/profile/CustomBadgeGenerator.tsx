import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { trackBadgeDownload } from '@/lib/badgeAnalytics';
import { useAuth } from '@/contexts/AuthContext';


const colorSchemes = [
  { id: 'blue-gold', name: 'Classic Blue & Gold', bg: 'bg-blue-600', text: 'text-white', image: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1763735412413_5f434d26.webp' },
  { id: 'navy-silver', name: 'Navy & Silver', bg: 'bg-slate-800', text: 'text-white', image: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1763735413502_62013d12.webp' },
  { id: 'green-gold', name: 'Forest Green & Gold', bg: 'bg-green-700', text: 'text-white', image: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1763735414735_e0323566.webp' },
  { id: 'burgundy-gold', name: 'Burgundy & Gold', bg: 'bg-red-900', text: 'text-white', image: 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1763735415978_2af2f7fd.webp' },
];

const certificationLevels = [
  'None',
  'NAREI Certified Professional',
  'NAREI Advanced Certification',
  'NAREI Master Certification',
  'Chapter Leader',
];

export default function CustomBadgeGenerator({ membershipTier }: { membershipTier: string }) {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [memberSince, setMemberSince] = useState(new Date().getFullYear().toString());
  const [certification, setCertification] = useState('None');
  const [colorScheme, setColorScheme] = useState(colorSchemes[0]);

  const handleDownload = async (format: 'social' | 'website' | 'print') => {
    if (!user) return;

    // Track the download
    await trackBadgeDownload({
      userId: user.id,
      badgeType: 'custom',
      colorScheme: colorScheme.id,
      badgeFormat: format,
      companyName: companyName || undefined,
      memberSince: memberSince || undefined,
      certificationLevel: certification !== 'None' ? certification : undefined,
    });

    // Create canvas for custom badge
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 800, 800);
      
      // Add custom text
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      
      if (companyName) {
        ctx.font = 'bold 36px Arial';
        ctx.fillText(companyName, 400, 450);
      }
      
      if (memberSince) {
        ctx.font = '24px Arial';
        ctx.fillText(`Member Since ${memberSince}`, 400, 520);
      }
      
      if (certification !== 'None') {
        ctx.font = '20px Arial';
        ctx.fillText(certification, 400, 580);
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `narei-badge-${format}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    };
    img.src = colorScheme.image;
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Custom Badge Generator
        </CardTitle>
        <CardDescription>
          Personalize your member badge with your company details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                placeholder="Your Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                maxLength={40}
              />
            </div>

            <div>
              <Label htmlFor="year">Member Since</Label>
              <Input
                id="year"
                type="number"
                min="2000"
                max={new Date().getFullYear()}
                value={memberSince}
                onChange={(e) => setMemberSince(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="cert">Certification Level</Label>
              <Select value={certification} onValueChange={setCertification}>
                <SelectTrigger id="cert">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {certificationLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Color Scheme</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {colorSchemes.map((scheme) => (
                  <Button
                    key={scheme.id}
                    variant={colorScheme.id === scheme.id ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setColorScheme(scheme)}
                  >
                    <div className={`w-4 h-4 rounded-full ${scheme.bg} mr-2`} />
                    {scheme.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Live Preview</Label>
            <div className="relative">
              <img
                src={colorScheme.image}
                alt="Badge preview"
                className="w-full rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
                {companyName && (
                  <div className="font-bold text-2xl mb-2">{companyName}</div>
                )}
                {memberSince && (
                  <div className="text-sm mb-1">Member Since {memberSince}</div>
                )}
                {certification !== 'None' && (
                  <div className="text-xs">{certification}</div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => handleDownload('social')}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download for Social Media (1:1)
              </Button>
              <Button
                onClick={() => handleDownload('website')}
                variant="outline"
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download for Website
              </Button>
              <Button
                onClick={() => handleDownload('print')}
                variant="outline"
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download for Print (High-Res)
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Usage Tips:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Use the social media version for LinkedIn, Twitter, and Facebook profiles</li>
            <li>• Add the website badge to your footer or about page</li>
            <li>• Print version is high-resolution for business cards and marketing materials</li>
            <li>• All badges maintain NAREI brand guidelines and color consistency</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
